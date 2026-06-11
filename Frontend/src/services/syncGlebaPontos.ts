import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncGlebaPontos(database: SQLiteDatabase) {
    const token = await getToken();

    const pontos = await database.getAllAsync<{
        id: number;
        latitude: number;
        longitude: number;
        ordem: number;
        gleba_id: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM gleba_pontos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('GlebaPontos dirty:', pontos.length);

    if (pontos.length) {
        const pontosComIds = await Promise.all(
            pontos.map(async (ponto) => {
                const gleba = await database.getFirstAsync<{ server_id: number }>(
                    `SELECT server_id FROM glebas WHERE id = $id`,
                    { $id: ponto.gleba_id }
                );
                return { ...ponto, gleba_id: gleba?.server_id };
            })
        );

        for (const ponto of pontosComIds) {
            if (ponto.server_id) {
                const response = await fetch(`${API_URL}/gleba_pontos/${ponto.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ gleba_ponto: { latitude: ponto.latitude, longitude: ponto.longitude, ordem: ponto.ordem, gleba_id: ponto.gleba_id } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE gleba_pontos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: ponto.id }
                    );
                    console.log(`GlebaPonto ${ponto.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/gleba_pontos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ gleba_pontos: [ponto] })
                });
                const data = await response.json();
                if (data.gleba_pontos?.[0]) {
                    await database.runAsync(
                        `UPDATE gleba_pontos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.gleba_pontos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: ponto.id }
                    );
                    console.log(`GlebaPonto ${ponto.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM gleba_pontos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/gleba_pontos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/gleba_pontos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const pontosServidor = Array.isArray(rawData) ? rawData : rawData.gleba_pontos;

    for (const p of pontosServidor ?? []) {
        const glebaLocal = await database.getFirstAsync<{ id: number }>(
            `SELECT id FROM glebas WHERE server_id = $server_id`,
            { $server_id: p.gleba_id }
        );

        if (!glebaLocal) {
            console.log(`Gleba não localizada para server_id: ${p.gleba_id}`);
            continue;
        }

        const existeLocal = await database.getFirstAsync(`SELECT id FROM gleba_pontos WHERE server_id = $server_id`, { $server_id: p.id });

        if (existeLocal) {
            await database.runAsync(
                `UPDATE gleba_pontos SET latitude = $latitude, longitude = $longitude, ordem = $ordem, gleba_id = $gleba_id, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $latitude: p.latitude, $longitude: p.longitude, $ordem: p.ordem, $gleba_id: glebaLocal.id, $updated_at: p.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: p.id }
            );
            console.log(`GlebaPonto ${p.id} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO gleba_pontos (latitude, longitude, ordem, gleba_id, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($latitude, $longitude, $ordem, $gleba_id, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $latitude: p.latitude, $longitude: p.longitude, $ordem: p.ordem, $gleba_id: glebaLocal.id, $server_id: p.id, $created_at: p.created_at, $updated_at: p.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`GlebaPonto ${p.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de gleba_pontos concluída!');
}
