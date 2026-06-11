import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncInsumos(database: SQLiteDatabase) {
    const token = await getToken();

    const insumos = await database.getAllAsync<{
        id: number;
        descricao: string;
        semente: number;
        ativo: number;
        unidades_medida_id: number;
        principios_ativos_id: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM insumos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('Insumos dirty:', insumos.length);

    if (insumos.length) {
        const insumosComIds = await Promise.all(
            insumos.map(async (insumo) => {
                const [unidadeMedida, principioAtivo] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM unidades_medidas WHERE id = $id`,
                        { $id: insumo.unidades_medida_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM principios_ativos WHERE id = $id`,
                        { $id: insumo.principios_ativos_id }
                    ),
                ]);
                return {
                    ...insumo,
                    unidades_medida_id: unidadeMedida?.server_id,
                    principios_ativos_id: principioAtivo?.server_id,
                };
            })
        );

        for (const insumo of insumosComIds) {
            if (insumo.server_id) {
                const response = await fetch(`${API_URL}/insumos/${insumo.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ insumo: { descricao: insumo.descricao, semente: insumo.semente, ativo: insumo.ativo, unidades_medida_id: insumo.unidades_medida_id, principios_ativos_id: insumo.principios_ativos_id, deleted_at: insumo.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE insumos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: insumo.id }
                    );
                    console.log(`Insumo ${insumo.descricao} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/insumos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ insumos: [insumo] })
                });
                const data = await response.json();
                if (data.insumos?.[0]) {
                    await database.runAsync(
                        `UPDATE insumos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.insumos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: insumo.id }
                    );
                    console.log(`Insumo ${insumo.descricao} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM insumos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/insumos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/insumos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const insumosServidor = Array.isArray(rawData) ? rawData : rawData.insumos;

    for (const i of insumosServidor ?? []) {
        const [unidadeMedidaLocal, principioAtivoLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM unidades_medidas WHERE server_id = $server_id`, { $server_id: i.unidades_medida_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM principios_ativos WHERE server_id = $server_id`, { $server_id: i.principios_ativos_id }),
            database.getFirstAsync(`SELECT id FROM insumos WHERE server_id = $server_id`, { $server_id: i.id }),
        ]);

        if (!unidadeMedidaLocal) {
            console.log(`UnidadeMedida não localizada para server_id: ${i.unidades_medida_id}`);
            continue;
        }
        if (!principioAtivoLocal) {
            console.log(`PrincipioAtivo não localizado para server_id: ${i.principios_ativos_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE insumos SET descricao = $descricao, semente = $semente, ativo = $ativo, unidades_medida_id = $unidades_medida_id, principios_ativos_id = $principios_ativos_id, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $descricao: i.descricao, $semente: i.semente ? 1 : 0, $ativo: i.ativo ? 1 : 0, $unidades_medida_id: unidadeMedidaLocal.id, $principios_ativos_id: principioAtivoLocal.id, $deleted_at: i.deleted_at ?? null, $updated_at: i.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: i.id }
            );
            console.log(`Insumo ${i.descricao} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO insumos (descricao, semente, ativo, unidades_medida_id, principios_ativos_id, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($descricao, $semente, $ativo, $unidades_medida_id, $principios_ativos_id, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $descricao: i.descricao, $semente: i.semente ? 1 : 0, $ativo: i.ativo ? 1 : 0, $unidades_medida_id: unidadeMedidaLocal.id, $principios_ativos_id: principioAtivoLocal.id, $server_id: i.id, $created_at: i.created_at, $updated_at: i.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: i.deleted_at ?? null }
            );
            console.log(`Insumo ${i.descricao} inserido localmente!`);
        }
    }

    console.log('Sincronização de insumos concluída!');
}
