import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncGlebas(database: SQLiteDatabase) {
    const token = await getToken();

    const glebas = await database.getAllAsync<{
        id: number;
        descricao: string;
        ativo: number;
        area_hectares: number;
        propriedade_id: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM glebas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('Glebas dirty:', glebas.length);

    if (glebas.length) {
        const glebasComIds = await Promise.all(
            glebas.map(async (gleba) => {
                const propriedade = await database.getFirstAsync<{ server_id: number }>(
                    `SELECT server_id FROM propriedades WHERE id = $id`,
                    { $id: gleba.propriedade_id }
                );
                return { ...gleba, propriedade_id: propriedade?.server_id };
            })
        );

        for (const gleba of glebasComIds) {
            if (gleba.server_id) {
                const response = await fetch(`${API_URL}/glebas/${gleba.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ gleba: { descricao: gleba.descricao, ativo: gleba.ativo, area_hectares: gleba.area_hectares, propriedade_id: gleba.propriedade_id, deleted_at: gleba.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE glebas SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: gleba.id }
                    );
                    console.log(`Gleba ${gleba.descricao} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/glebas/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ glebas: [gleba] })
                });
                const data = await response.json();
                if (data.glebas?.[0]) {
                    await database.runAsync(
                        `UPDATE glebas SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.glebas[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: gleba.id }
                    );
                    console.log(`Gleba ${gleba.descricao} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM glebas`);
    const url = ultimaSync?.synced_at ? `${API_URL}/glebas?updated_after=${ultimaSync.synced_at}` : `${API_URL}/glebas`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const glebasServidor = Array.isArray(rawData) ? rawData : rawData.glebas;

    for (const g of glebasServidor ?? []) {
        const propriedadeLocal = await database.getFirstAsync<{ id: number }>(
            `SELECT id FROM propriedades WHERE server_id = $server_id`,
            { $server_id: g.propriedade_id }
        );

        if (!propriedadeLocal) {
            console.log(`Propriedade não localizada para server_id: ${g.propriedade_id}`);
            continue;
        }

        const existeLocal = await database.getFirstAsync(`SELECT id FROM glebas WHERE server_id = $server_id`, { $server_id: g.id });

        if (existeLocal) {
            await database.runAsync(
                `UPDATE glebas SET descricao = $descricao, ativo = $ativo, area_hectares = $area_hectares, propriedade_id = $propriedade_id, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $descricao: g.descricao, $ativo: g.ativo ? 1 : 0, $area_hectares: g.area_hectares, $propriedade_id: propriedadeLocal.id, $deleted_at: g.deleted_at ?? null, $updated_at: g.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: g.id }
            );
            console.log(`Gleba ${g.descricao} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO glebas (descricao, ativo, area_hectares, propriedade_id, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($descricao, $ativo, $area_hectares, $propriedade_id, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $descricao: g.descricao, $ativo: g.ativo ? 1 : 0, $area_hectares: g.area_hectares, $propriedade_id: propriedadeLocal.id, $server_id: g.id, $created_at: g.created_at, $updated_at: g.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: g.deleted_at ?? null }
            );
            console.log(`Gleba ${g.descricao} inserida localmente!`);
        }
    }

    console.log('Sincronização de glebas concluída!');
}
