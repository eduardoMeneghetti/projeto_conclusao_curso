import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAnaliseSoloResultados(database: SQLiteDatabase) {
    const token = await getToken();

    const resultados = await database.getAllAsync<{
        id: number;
        analises_solo_id: number;
        parametro_medido: string;
        parametro_medido_id: number;
        valor: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM analises_solo_resultados WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AnaliseSoloResultados dirty:', resultados.length);

    if (resultados.length) {
        const resultadosComIds = await Promise.all(
            resultados.map(async (resultado) => {
                const [analiseSolo, parametroMetrica] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM analises_solos WHERE id = $id`,
                        { $id: resultado.analises_solo_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM parametros_metricas WHERE id = $id`,
                        { $id: resultado.parametro_medido_id }
                    ),
                ]);
                return {
                    ...resultado,
                    analises_solo_id: analiseSolo?.server_id,
                    parametro_medido_id: parametroMetrica?.server_id,
                };
            })
        );

        for (const resultado of resultadosComIds) {
            if (resultado.server_id) {
                const response = await fetch(`${API_URL}/analises_solo_resultados/${resultado.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ analise_solo_resultado: { analises_solo_id: resultado.analises_solo_id, parametro_medido: resultado.parametro_medido, parametro_medido_id: resultado.parametro_medido_id, valor: resultado.valor } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE analises_solo_resultados SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: resultado.id }
                    );
                    console.log(`AnaliseSoloResultado ${resultado.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/analises_solo_resultados/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ analises_solo_resultados: [resultado] })
                });
                const data = await response.json();
                if (data.analises_solo_resultados?.[0]) {
                    await database.runAsync(
                        `UPDATE analises_solo_resultados SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.analises_solo_resultados[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: resultado.id }
                    );
                    console.log(`AnaliseSoloResultado ${resultado.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM analises_solo_resultados`);
    const url = ultimaSync?.synced_at ? `${API_URL}/analises_solo_resultados?updated_after=${ultimaSync.synced_at}` : `${API_URL}/analises_solo_resultados`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const resultadosServidor = Array.isArray(rawData) ? rawData : rawData.analises_solo_resultados;

    for (const r of resultadosServidor ?? []) {
        const [analiseSoloLocal, parametroMetricaLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM analises_solos WHERE server_id = $server_id`, { $server_id: r.analises_solo_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM parametros_metricas WHERE server_id = $server_id`, { $server_id: r.parametro_medido_id }),
            database.getFirstAsync(`SELECT id FROM analises_solo_resultados WHERE server_id = $server_id`, { $server_id: r.id }),
        ]);

        if (!analiseSoloLocal) {
            console.log(`AnaliseSolo não localizada para server_id: ${r.analises_solo_id}`);
            continue;
        }

        const parametroMedidoLocalId = parametroMetricaLocal?.id ?? null;

        if (existeLocal) {
            await database.runAsync(
                `UPDATE analises_solo_resultados SET analises_solo_id = $analises_solo_id, parametro_medido = $parametro_medido, parametro_medido_id = $parametro_medido_id, valor = $valor, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $analises_solo_id: analiseSoloLocal.id, $parametro_medido: r.parametro_medido, $parametro_medido_id: parametroMedidoLocalId, $valor: r.valor, $updated_at: r.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: r.id }
            );
            console.log(`AnaliseSoloResultado ${r.id} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO analises_solo_resultados (analises_solo_id, parametro_medido, parametro_medido_id, valor, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($analises_solo_id, $parametro_medido, $parametro_medido_id, $valor, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $analises_solo_id: analiseSoloLocal.id, $parametro_medido: r.parametro_medido, $parametro_medido_id: parametroMedidoLocalId, $valor: r.valor, $server_id: r.id, $created_at: r.created_at, $updated_at: r.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`AnaliseSoloResultado ${r.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de analises_solo_resultados concluída!');
}
