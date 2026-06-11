import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAjusteEstoques(database: SQLiteDatabase) {
    const token = await getToken();

    const ajustes = await database.getAllAsync<{
        id: number;
        usuario_id: number;
        propriedade_id: number;
        observacao: string | null;
        data: string;
        entrada_saida: string;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM ajuste_estoques WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AjusteEstoques dirty:', ajustes.length);

    if (ajustes.length) {
        const ajustesComIds = await Promise.all(
            ajustes.map(async (ajuste) => {
                const [usuario, propriedade] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM usuarios WHERE id = $id`,
                        { $id: ajuste.usuario_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM propriedades WHERE id = $id`,
                        { $id: ajuste.propriedade_id }
                    ),
                ]);
                return {
                    ...ajuste,
                    usuario_id: usuario?.server_id,
                    propriedade_id: propriedade?.server_id,
                };
            })
        );

        for (const ajuste of ajustesComIds) {
            if (ajuste.server_id) {
                const response = await fetch(`${API_URL}/ajuste_estoques/${ajuste.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ ajuste_estoque: { usuario_id: ajuste.usuario_id, propriedade_id: ajuste.propriedade_id, observacao: ajuste.observacao, data: ajuste.data, entrada_saida: ajuste.entrada_saida, deleted_at: ajuste.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE ajuste_estoques SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: ajuste.id }
                    );
                    console.log(`AjusteEstoque ${ajuste.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/ajuste_estoques/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ ajuste_estoques: [ajuste] })
                });
                const data = await response.json();
                if (data.ajuste_estoques?.[0]) {
                    await database.runAsync(
                        `UPDATE ajuste_estoques SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.ajuste_estoques[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: ajuste.id }
                    );
                    console.log(`AjusteEstoque ${ajuste.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM ajuste_estoques`);
    const url = ultimaSync?.synced_at ? `${API_URL}/ajuste_estoques?updated_after=${ultimaSync.synced_at}` : `${API_URL}/ajuste_estoques`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const ajustesServidor = Array.isArray(rawData) ? rawData : rawData.ajuste_estoques;

    for (const a of ajustesServidor ?? []) {
        const [usuarioLocal, propriedadeLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM usuarios WHERE server_id = $server_id`, { $server_id: a.usuario_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM propriedades WHERE server_id = $server_id`, { $server_id: a.propriedade_id }),
            database.getFirstAsync(`SELECT id FROM ajuste_estoques WHERE server_id = $server_id`, { $server_id: a.id }),
        ]);

        if (!usuarioLocal) {
            console.log(`Usuario não localizado para server_id: ${a.usuario_id}`);
            continue;
        }
        if (!propriedadeLocal) {
            console.log(`Propriedade não localizada para server_id: ${a.propriedade_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE ajuste_estoques SET usuario_id = $usuario_id, propriedade_id = $propriedade_id, observacao = $observacao, data = $data, entrada_saida = $entrada_saida, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $usuario_id: usuarioLocal.id, $propriedade_id: propriedadeLocal.id, $observacao: a.observacao ?? null, $data: a.data, $entrada_saida: a.entrada_saida, $deleted_at: a.deleted_at ?? null, $updated_at: a.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: a.id }
            );
            console.log(`AjusteEstoque ${a.id} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO ajuste_estoques (usuario_id, propriedade_id, observacao, data, entrada_saida, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($usuario_id, $propriedade_id, $observacao, $data, $entrada_saida, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $usuario_id: usuarioLocal.id, $propriedade_id: propriedadeLocal.id, $observacao: a.observacao ?? null, $data: a.data, $entrada_saida: a.entrada_saida, $server_id: a.id, $created_at: a.created_at, $updated_at: a.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: a.deleted_at ?? null }
            );
            console.log(`AjusteEstoque ${a.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de ajuste_estoques concluída!');
}
