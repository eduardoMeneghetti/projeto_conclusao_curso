import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncMovimentacaoEstoqueInsumos(database: SQLiteDatabase) {
    const token = await getToken();

    const movimentacoes = await database.getAllAsync<{
        id: number;
        quantidade: number;
        valor_unitario: number;
        origem: string;
        ajuste_estoque_id: number | null;
        aplicacoes_insumo_id: number | null;
        insumo_id: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM movimentacao_estoque_insumos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('MovimentacaoEstoqueInsumos dirty:', movimentacoes.length);

    if (movimentacoes.length) {
        const movimentacoesComIds = await Promise.all(
            movimentacoes.map(async (mov) => {
                const [ajusteEstoque, aplicacaoInsumo, insumo] = await Promise.all([
                    mov.ajuste_estoque_id
                        ? database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM ajuste_estoques WHERE id = $id`, { $id: mov.ajuste_estoque_id })
                        : Promise.resolve(null),
                    mov.aplicacoes_insumo_id
                        ? database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM aplicacoes_insumos WHERE id = $id`, { $id: mov.aplicacoes_insumo_id })
                        : Promise.resolve(null),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM insumos WHERE id = $id`, { $id: mov.insumo_id }),
                ]);
                return {
                    ...mov,
                    ajuste_estoque_id: ajusteEstoque?.server_id ?? null,
                    aplicacoes_insumo_id: aplicacaoInsumo?.server_id ?? null,
                    insumo_id: insumo?.server_id,
                };
            })
        );

        for (const mov of movimentacoesComIds) {
            if (mov.server_id) {
                const response = await fetch(`${API_URL}/movimentacao_estoque_insumos/${mov.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ movimentacao_estoque_insumo: { quantidade: mov.quantidade, valor_unitario: mov.valor_unitario, origem: mov.origem, ajuste_estoque_id: mov.ajuste_estoque_id, aplicacoes_insumo_id: mov.aplicacoes_insumo_id, insumo_id: mov.insumo_id, deleted_at: mov.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE movimentacao_estoque_insumos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: mov.id }
                    );
                    console.log(`MovimentacaoEstoqueInsumo ${mov.id} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/movimentacao_estoque_insumos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ movimentacao_estoque_insumos: [mov] })
                });
                const data = await response.json();
                if (data.movimentacao_estoque_insumos?.[0]) {
                    await database.runAsync(
                        `UPDATE movimentacao_estoque_insumos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.movimentacao_estoque_insumos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: mov.id }
                    );
                    console.log(`MovimentacaoEstoqueInsumo ${mov.id} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM movimentacao_estoque_insumos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/movimentacao_estoque_insumos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/movimentacao_estoque_insumos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const movimentacoesServidor = Array.isArray(rawData) ? rawData : rawData.movimentacao_estoque_insumos;

    for (const m of movimentacoesServidor ?? []) {
        const [ajusteEstoqueLocal, aplicacaoInsumoLocal, insumoLocal, existeLocal] = await Promise.all([
            m.ajuste_estoque_id ? database.getFirstAsync<{ id: number }>(`SELECT id FROM ajuste_estoques WHERE server_id = $server_id`, { $server_id: m.ajuste_estoque_id }) : Promise.resolve(null),
            m.aplicacoes_insumo_id ? database.getFirstAsync<{ id: number }>(`SELECT id FROM aplicacoes_insumos WHERE server_id = $server_id`, { $server_id: m.aplicacoes_insumo_id }) : Promise.resolve(null),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM insumos WHERE server_id = $server_id`, { $server_id: m.insumo_id }),
            database.getFirstAsync(`SELECT id FROM movimentacao_estoque_insumos WHERE server_id = $server_id`, { $server_id: m.id }),
        ]);

        if (!insumoLocal) {
            console.log(`Insumo não localizado para server_id: ${m.insumo_id}`);
            continue;
        }

        const ajusteEstoqueLocalId = ajusteEstoqueLocal?.id ?? null;
        const aplicacaoInsumoLocalId = aplicacaoInsumoLocal?.id ?? null;

        if (existeLocal) {
            await database.runAsync(
                `UPDATE movimentacao_estoque_insumos SET quantidade = $quantidade, valor_unitario = $valor_unitario, origem = $origem, ajuste_estoque_id = $ajuste_estoque_id, aplicacoes_insumo_id = $aplicacoes_insumo_id, insumo_id = $insumo_id, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $quantidade: m.quantidade, $valor_unitario: m.valor_unitario, $origem: m.origem, $ajuste_estoque_id: ajusteEstoqueLocalId, $aplicacoes_insumo_id: aplicacaoInsumoLocalId, $insumo_id: insumoLocal.id, $deleted_at: m.deleted_at ?? null, $updated_at: m.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: m.id }
            );
            console.log(`MovimentacaoEstoqueInsumo ${m.id} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO movimentacao_estoque_insumos (quantidade, valor_unitario, origem, ajuste_estoque_id, aplicacoes_insumo_id, insumo_id, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($quantidade, $valor_unitario, $origem, $ajuste_estoque_id, $aplicacoes_insumo_id, $insumo_id, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $quantidade: m.quantidade, $valor_unitario: m.valor_unitario, $origem: m.origem, $ajuste_estoque_id: ajusteEstoqueLocalId, $aplicacoes_insumo_id: aplicacaoInsumoLocalId, $insumo_id: insumoLocal.id, $server_id: m.id, $created_at: m.created_at, $updated_at: m.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: m.deleted_at ?? null }
            );
            console.log(`MovimentacaoEstoqueInsumo ${m.id} inserida localmente!`);
        }
    }

    console.log('Sincronização de movimentacao_estoque_insumos concluída!');
}
