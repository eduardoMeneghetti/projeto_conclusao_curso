import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncMaquinas(database: SQLiteDatabase) {
    const token = await getToken();

    const maquinas = await database.getAllAsync<{
        id: number;
        descricao: string;
        ativo: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM maquinas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('Maquinas dirty:', maquinas.length);

    if (maquinas.length) {
        for (const maquina of maquinas) {
            if (maquina.server_id) {
                const response = await fetch(`${API_URL}/maquinas/${maquina.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ maquina: { descricao: maquina.descricao, ativo: maquina.ativo, deleted_at: maquina.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE maquinas SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: maquina.id }
                    );
                    console.log(`Maquina ${maquina.descricao} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/maquinas/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ maquinas: [maquina] })
                });
                const data = await response.json();
                if (data.maquinas?.[0]) {
                    await database.runAsync(
                        `UPDATE maquinas SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.maquinas[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: maquina.id }
                    );
                    console.log(`Maquina ${maquina.descricao} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM maquinas`);
    const url = ultimaSync?.synced_at ? `${API_URL}/maquinas?updated_after=${ultimaSync.synced_at}` : `${API_URL}/maquinas`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const maquinasServidor = Array.isArray(rawData) ? rawData : rawData.maquinas;

    for (const m of maquinasServidor ?? []) {
        const existeLocal = await database.getFirstAsync(`SELECT id FROM maquinas WHERE server_id = $server_id`, { $server_id: m.id });
        if (existeLocal) {
            await database.runAsync(
                `UPDATE maquinas SET descricao = $descricao, ativo = $ativo, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $descricao: m.descricao, $ativo: m.ativo ? 1 : 0, $deleted_at: m.deleted_at ?? null, $updated_at: m.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: m.id }
            );
            console.log(`Maquina ${m.descricao} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO maquinas (descricao, ativo, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($descricao, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $descricao: m.descricao, $ativo: m.ativo ? 1 : 0, $server_id: m.id, $created_at: m.created_at, $updated_at: m.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: m.deleted_at ?? null }
            );
            console.log(`Maquina ${m.descricao} inserida localmente!`);
        }
    }

    console.log('Sincronização de máquinas concluída!');
}