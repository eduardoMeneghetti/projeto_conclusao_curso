import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAtividadeGlebas(database: SQLiteDatabase) {
    const token = await getToken();

    const atividadeGlebas = await database.getAllAsync<{
        id: number;
        gleba_id: number;
        atividade_safra_id: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM atividade_glebas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AtividadeGlebas dirty:', atividadeGlebas.length);

    if (atividadeGlebas.length) {
        const atividadeGlebasComIds = await Promise.all(
            atividadeGlebas.map(async (ag) => {
                const [gleba, atividadeSafra] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM glebas WHERE id = $id`,
                        { $id: ag.gleba_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM atividade_safras WHERE id = $id`,
                        { $id: ag.atividade_safra_id }
                    ),
                ]);
                return {
                    ...ag,
                    gleba_id: gleba?.server_id,
                    atividade_safra_id: atividadeSafra?.server_id,
                };
            })
        );

        for (const ag of atividadeGlebasComIds) {
            if (ag.server_id) {
                const response = await fetch(`${API_URL}/atividade_glebas/${ag.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ atividade_gleba: { gleba_id: ag.gleba_id, atividade_safra_id: ag.atividade_safra_id } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE atividade_glebas SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: ag.id }
                    );
                    console.log(`AtividadeGleba ${ag.id} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/atividade_glebas/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ atividade_glebas: [ag] })
                });
                const data = await response.json();
                if (data.atividade_glebas?.[0]) {
                    await database.runAsync(
                        `UPDATE atividade_glebas SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.atividade_glebas[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: ag.id }
                    );
                    console.log(`AtividadeGleba ${ag.id} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM atividade_glebas`);
    const url = ultimaSync?.synced_at ? `${API_URL}/atividade_glebas?updated_after=${ultimaSync.synced_at}` : `${API_URL}/atividade_glebas`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const atividadeGlebasServidor = Array.isArray(rawData) ? rawData : rawData.atividade_glebas;

    for (const ag of atividadeGlebasServidor ?? []) {
        const [glebaLocal, atividadeSafraLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM glebas WHERE server_id = $server_id`, { $server_id: ag.gleba_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_safras WHERE server_id = $server_id`, { $server_id: ag.atividade_safra_id }),
            database.getFirstAsync(`SELECT id FROM atividade_glebas WHERE server_id = $server_id`, { $server_id: ag.id }),
        ]);

        if (!glebaLocal) {
            console.log(`Gleba não localizada para server_id: ${ag.gleba_id}`);
            continue;
        }
        if (!atividadeSafraLocal) {
            console.log(`AtividadeSafra não localizada para server_id: ${ag.atividade_safra_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE atividade_glebas SET gleba_id = $gleba_id, atividade_safra_id = $atividade_safra_id, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $gleba_id: glebaLocal.id, $atividade_safra_id: atividadeSafraLocal.id, $updated_at: ag.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: ag.id }
            );
            console.log(`AtividadeGleba ${ag.id} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO atividade_glebas (gleba_id, atividade_safra_id, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($gleba_id, $atividade_safra_id, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $gleba_id: glebaLocal.id, $atividade_safra_id: atividadeSafraLocal.id, $server_id: ag.id, $created_at: ag.created_at, $updated_at: ag.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`AtividadeGleba ${ag.id} inserida localmente!`);
        }
    }

    console.log('Sincronização de atividade_glebas concluída!');
}
