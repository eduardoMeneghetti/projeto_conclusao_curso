import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncRecomendacoesAgricolasItens(database: SQLiteDatabase) {
    const token = await getToken();

    const itens = await database.getAllAsync<{
        id: number;
        recomendacao_agricola_id: number;
        insumo_id: number;
        dose: number;
        quantidade: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM recomendacoes_agricolas_itens WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('RecomendacoesAgricolasItens dirty:', itens.length);

    if (itens.length) {
        const itensComIds = await Promise.all(
            itens.map(async (item) => {
                const [recomendacao, insumo] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM recomendacoes_agricolas WHERE id = $id`, { $id: item.recomendacao_agricola_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM insumos WHERE id = $id`, { $id: item.insumo_id }),
                ]);
                return {
                    ...item,
                    recomendacao_agricola_id: recomendacao?.server_id,
                    insumo_id: insumo?.server_id,
                };
            })
        );

        for (const item of itensComIds) {
            if (item.server_id) {
                const response = await fetch(`${API_URL}/recomendacoes_agricolas_itens/${item.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ recomendacao_agricola_item: { recomendacao_agricola_id: item.recomendacao_agricola_id, insumo_id: item.insumo_id, dose: item.dose, quantidade: item.quantidade, deleted_at: item.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE recomendacoes_agricolas_itens SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: item.id }
                    );
                    console.log(`RecomendacaoAgricolaItem ${item.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/recomendacoes_agricolas_itens/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ recomendacoes_agricolas_itens: [item] })
                });
                const data = await response.json();
                if (data.recomendacoes_agricolas_itens?.[0]) {
                    await database.runAsync(
                        `UPDATE recomendacoes_agricolas_itens SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.recomendacoes_agricolas_itens[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: item.id }
                    );
                    console.log(`RecomendacaoAgricolaItem ${item.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM recomendacoes_agricolas_itens`);
    const url = ultimaSync?.synced_at ? `${API_URL}/recomendacoes_agricolas_itens?updated_after=${ultimaSync.synced_at}` : `${API_URL}/recomendacoes_agricolas_itens`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const itensServidor = Array.isArray(rawData) ? rawData : rawData.recomendacoes_agricolas_itens;

    for (const i of itensServidor ?? []) {
        const [recomendacaoLocal, insumoLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM recomendacoes_agricolas WHERE server_id = $server_id`, { $server_id: i.recomendacao_agricola_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM insumos WHERE server_id = $server_id`, { $server_id: i.insumo_id }),
            database.getFirstAsync(`SELECT id FROM recomendacoes_agricolas_itens WHERE server_id = $server_id`, { $server_id: i.id }),
        ]);

        if (!recomendacaoLocal) {
            console.log(`RecomendacaoAgricola não localizada para server_id: ${i.recomendacao_agricola_id}`);
            continue;
        }
        if (!insumoLocal) {
            console.log(`Insumo não localizado para server_id: ${i.insumo_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE recomendacoes_agricolas_itens SET recomendacao_agricola_id = $recomendacao_agricola_id, insumo_id = $insumo_id, dose = $dose, quantidade = $quantidade, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $recomendacao_agricola_id: recomendacaoLocal.id, $insumo_id: insumoLocal.id, $dose: i.dose, $quantidade: i.quantidade, $deleted_at: i.deleted_at ?? null, $updated_at: i.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: i.id }
            );
            console.log(`RecomendacaoAgricolaItem ${i.id} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO recomendacoes_agricolas_itens (recomendacao_agricola_id, insumo_id, dose, quantidade, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($recomendacao_agricola_id, $insumo_id, $dose, $quantidade, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $recomendacao_agricola_id: recomendacaoLocal.id, $insumo_id: insumoLocal.id, $dose: i.dose, $quantidade: i.quantidade, $server_id: i.id, $created_at: i.created_at, $updated_at: i.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: i.deleted_at ?? null }
            );
            console.log(`RecomendacaoAgricolaItem ${i.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de recomendacoes_agricolas_itens concluída!');
}
