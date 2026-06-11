import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncFichamentos(database: SQLiteDatabase) {
    const token = await getToken();

    const fichamentos = await database.getAllAsync<{
        id: number;
        parametros_metrica_id: number;
        classificacao: string;
        valor_min: number;
        valor_max: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM fichamentos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('Fichamentos dirty:', fichamentos.length);

    if (fichamentos.length) {
        const fichamentosComIds = await Promise.all(
            fichamentos.map(async (fichamento) => {
                const parametro = await database.getFirstAsync<{ server_id: number }>(
                    `SELECT server_id FROM parametros_metricas WHERE id = $id`,
                    { $id: fichamento.parametros_metrica_id }
                );
                return { ...fichamento, parametros_metrica_id: parametro?.server_id };
            })
        );

        for (const fichamento of fichamentosComIds) {
            if (fichamento.server_id) {
                const response = await fetch(`${API_URL}/fichamentos/${fichamento.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ fichamento: { parametros_metrica_id: fichamento.parametros_metrica_id, classificacao: fichamento.classificacao, valor_min: fichamento.valor_min, valor_max: fichamento.valor_max } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE fichamentos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: fichamento.id }
                    );
                    console.log(`Fichamento ${fichamento.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/fichamentos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ fichamentos: [fichamento] })
                });
                const data = await response.json();
                if (data.fichamentos?.[0]) {
                    await database.runAsync(
                        `UPDATE fichamentos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.fichamentos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: fichamento.id }
                    );
                    console.log(`Fichamento ${fichamento.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM fichamentos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/fichamentos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/fichamentos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const fichamentosServidor = Array.isArray(rawData) ? rawData : rawData.fichamentos;

    for (const f of fichamentosServidor ?? []) {
        const [parametroLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM parametros_metricas WHERE server_id = $server_id`, { $server_id: f.parametros_metrica_id }),
            database.getFirstAsync(`SELECT id FROM fichamentos WHERE server_id = $server_id`, { $server_id: f.id }),
        ]);

        if (!parametroLocal) {
            console.log(`ParametroMetrica não localizado para server_id: ${f.parametros_metrica_id}`);
            continue;
        }

        // se não achou pelo server_id, tenta casar com registro semeado localmente (server_id IS NULL)
        if (!existeLocal) {
            existeLocal = await database.getFirstAsync(
                `SELECT id FROM fichamentos WHERE parametros_metrica_id = $pm AND classificacao = $c AND server_id IS NULL`,
                { $pm: parametroLocal.id, $c: f.classificacao }
            );
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE fichamentos SET parametros_metrica_id = $parametros_metrica_id, classificacao = $classificacao, valor_min = $valor_min, valor_max = $valor_max, server_id = $server_id, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                { $parametros_metrica_id: parametroLocal.id, $classificacao: f.classificacao, $valor_min: f.valor_min, $valor_max: f.valor_max, $server_id: f.id, $updated_at: f.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: existeLocal.id }
            );
            console.log(`Fichamento ${f.id} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO fichamentos (parametros_metrica_id, classificacao, valor_min, valor_max, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($parametros_metrica_id, $classificacao, $valor_min, $valor_max, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $parametros_metrica_id: parametroLocal.id, $classificacao: f.classificacao, $valor_min: f.valor_min, $valor_max: f.valor_max, $server_id: f.id, $created_at: f.created_at, $updated_at: f.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`Fichamento ${f.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de fichamentos concluída!');
}
