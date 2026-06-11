import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncPrincipiosAtivos(database: SQLiteDatabase) {
    const token = await getToken();

    const principios = await database.getAllAsync<{
        id: number;
        descricao: string;
        ativo: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM principios_ativos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('PrincipiosAtivos dirty:', principios.length);

    if (principios.length) {
        for (const principio of principios) {
            if (principio.server_id) {
                const response = await fetch(`${API_URL}/principios_ativos/${principio.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ principio_ativo: { descricao: principio.descricao, ativo: principio.ativo, deleted_at: principio.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE principios_ativos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: principio.id }
                    );
                    console.log(`PrincipioAtivo ${principio.descricao} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/principios_ativos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ principios_ativos: [principio] })
                });
                const data = await response.json();
                if (data.principios_ativos?.[0]) {
                    await database.runAsync(
                        `UPDATE principios_ativos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.principios_ativos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: principio.id }
                    );
                    console.log(`PrincipioAtivo ${principio.descricao} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM principios_ativos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/principios_ativos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/principios_ativos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const principiosServidor = Array.isArray(rawData) ? rawData : rawData.principios_ativos;

    for (const p of principiosServidor ?? []) {
        const existeLocal = await database.getFirstAsync(`SELECT id FROM principios_ativos WHERE server_id = $server_id`, { $server_id: p.id });
        if (existeLocal) {
            await database.runAsync(
                `UPDATE principios_ativos SET descricao = $descricao, ativo = $ativo, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $descricao: p.descricao, $ativo: p.ativo ? 1 : 0, $deleted_at: p.deleted_at ?? null, $updated_at: p.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: p.id }
            );
            console.log(`PrincipioAtivo ${p.descricao} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO principios_ativos (descricao, ativo, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($descricao, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $descricao: p.descricao, $ativo: p.ativo ? 1 : 0, $server_id: p.id, $created_at: p.created_at, $updated_at: p.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: p.deleted_at ?? null }
            );
            console.log(`PrincipioAtivo ${p.descricao} inserido localmente!`);
        }
    }

    console.log('Sincronização de principios_ativos concluída!');
}
