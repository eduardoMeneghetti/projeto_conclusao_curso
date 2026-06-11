import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAplicacoesItensInsumos(database: SQLiteDatabase) {
    const token = await getToken();

    const itens = await database.getAllAsync<{
        id: number;
        aplicacoes_insumo_id: number;
        insumo_id: number;
        quantidade_aplic: number;
        dose_aplic: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM aplicacoes_itens_insumos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AplicacoesItensInsumos dirty:', itens.length);

    if (itens.length) {
        const itensComIds = await Promise.all(
            itens.map(async (item) => {
                const [aplicacao, insumo] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM aplicacoes_insumos WHERE id = $id`, { $id: item.aplicacoes_insumo_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM insumos WHERE id = $id`, { $id: item.insumo_id }),
                ]);
                return {
                    ...item,
                    aplicacoes_insumo_id: aplicacao?.server_id,
                    insumo_id: insumo?.server_id,
                };
            })
        );

        for (const item of itensComIds) {
            if (item.server_id) {
                const response = await fetch(`${API_URL}/aplicacoes_itens_insumos/${item.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ aplicacao_item_insumo: { aplicacoes_insumo_id: item.aplicacoes_insumo_id, insumo_id: item.insumo_id, quantidade_aplic: item.quantidade_aplic, dose_aplic: item.dose_aplic, deleted_at: item.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE aplicacoes_itens_insumos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: item.id }
                    );
                    console.log(`AplicacaoItemInsumo ${item.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/aplicacoes_itens_insumos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ aplicacoes_itens_insumos: [item] })
                });
                const data = await response.json();
                if (data.aplicacoes_itens_insumos?.[0]) {
                    await database.runAsync(
                        `UPDATE aplicacoes_itens_insumos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.aplicacoes_itens_insumos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: item.id }
                    );
                    console.log(`AplicacaoItemInsumo ${item.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM aplicacoes_itens_insumos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/aplicacoes_itens_insumos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/aplicacoes_itens_insumos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const itensServidor = Array.isArray(rawData) ? rawData : rawData.aplicacoes_itens_insumos;

    for (const i of itensServidor ?? []) {
        const [aplicacaoLocal, insumoLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM aplicacoes_insumos WHERE server_id = $server_id`, { $server_id: i.aplicacoes_insumo_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM insumos WHERE server_id = $server_id`, { $server_id: i.insumo_id }),
            database.getFirstAsync(`SELECT id FROM aplicacoes_itens_insumos WHERE server_id = $server_id`, { $server_id: i.id }),
        ]);

        if (!aplicacaoLocal) {
            console.log(`AplicacaoInsumo não localizada para server_id: ${i.aplicacoes_insumo_id}`);
            continue;
        }
        if (!insumoLocal) {
            console.log(`Insumo não localizado para server_id: ${i.insumo_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE aplicacoes_itens_insumos SET aplicacoes_insumo_id = $aplicacoes_insumo_id, insumo_id = $insumo_id, quantidade_aplic = $quantidade_aplic, dose_aplic = $dose_aplic, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $aplicacoes_insumo_id: aplicacaoLocal.id, $insumo_id: insumoLocal.id, $quantidade_aplic: i.quantidade_aplic, $dose_aplic: i.dose_aplic, $deleted_at: i.deleted_at ?? null, $updated_at: i.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: i.id }
            );
            console.log(`AplicacaoItemInsumo ${i.id} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO aplicacoes_itens_insumos (aplicacoes_insumo_id, insumo_id, quantidade_aplic, dose_aplic, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($aplicacoes_insumo_id, $insumo_id, $quantidade_aplic, $dose_aplic, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $aplicacoes_insumo_id: aplicacaoLocal.id, $insumo_id: insumoLocal.id, $quantidade_aplic: i.quantidade_aplic, $dose_aplic: i.dose_aplic, $server_id: i.id, $created_at: i.created_at, $updated_at: i.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: i.deleted_at ?? null }
            );
            console.log(`AplicacaoItemInsumo ${i.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de aplicacoes_itens_insumos concluída!');
}
