import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAnaliseSolos(database: SQLiteDatabase) {
    const token = await getToken();

    const analises = await database.getAllAsync<{
        id: number;
        atividade_gleba_id: number;
        atividade_safra_id: number;
        data_coleta: string;
        ativo: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM analises_solos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AnaliseSolos dirty:', analises.length);

    if (analises.length) {
        const analisesComIds = await Promise.all(
            analises.map(async (analise) => {
                const [atividadeGleba, atividadeSafra] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM atividade_glebas WHERE id = $id`,
                        { $id: analise.atividade_gleba_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM atividade_safras WHERE id = $id`,
                        { $id: analise.atividade_safra_id }
                    ),
                ]);
                return {
                    ...analise,
                    atividade_gleba_id: atividadeGleba?.server_id,
                    atividade_safra_id: atividadeSafra?.server_id,
                };
            })
        );

        for (const analise of analisesComIds) {
            if (analise.server_id) {
                const response = await fetch(`${API_URL}/analises_solos/${analise.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ analise_solo: { atividade_gleba_id: analise.atividade_gleba_id, atividade_safra_id: analise.atividade_safra_id, data_coleta: analise.data_coleta, ativo: analise.ativo, deleted_at: analise.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE analises_solos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: analise.id }
                    );
                    console.log(`AnaliseSolo ${analise.id} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/analises_solos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ analises_solos: [analise] })
                });
                const data = await response.json();
                if (data.analises_solos?.[0]) {
                    await database.runAsync(
                        `UPDATE analises_solos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.analises_solos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: analise.id }
                    );
                    console.log(`AnaliseSolo ${analise.id} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM analises_solos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/analises_solos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/analises_solos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const analisesServidor = Array.isArray(rawData) ? rawData : rawData.analises_solos;

    for (const a of analisesServidor ?? []) {
        const [atividadeGlebaLocal, atividadeSafraLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_glebas WHERE server_id = $server_id`, { $server_id: a.atividade_gleba_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_safras WHERE server_id = $server_id`, { $server_id: a.atividade_safra_id }),
            database.getFirstAsync(`SELECT id FROM analises_solos WHERE server_id = $server_id`, { $server_id: a.id }),
        ]);

        if (!atividadeGlebaLocal) {
            console.log(`AtividadeGleba não localizada para server_id: ${a.atividade_gleba_id}`);
            continue;
        }
        if (!atividadeSafraLocal) {
            console.log(`AtividadeSafra não localizada para server_id: ${a.atividade_safra_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE analises_solos SET atividade_gleba_id = $atividade_gleba_id, atividade_safra_id = $atividade_safra_id, data_coleta = $data_coleta, ativo = $ativo, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $atividade_gleba_id: atividadeGlebaLocal.id, $atividade_safra_id: atividadeSafraLocal.id, $data_coleta: a.data_coleta, $ativo: a.ativo ? 1 : 0, $deleted_at: a.deleted_at ?? null, $updated_at: a.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: a.id }
            );
            console.log(`AnaliseSolo ${a.id} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO analises_solos (atividade_gleba_id, atividade_safra_id, data_coleta, ativo, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($atividade_gleba_id, $atividade_safra_id, $data_coleta, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $atividade_gleba_id: atividadeGlebaLocal.id, $atividade_safra_id: atividadeSafraLocal.id, $data_coleta: a.data_coleta, $ativo: a.ativo ? 1 : 0, $server_id: a.id, $created_at: a.created_at, $updated_at: a.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: a.deleted_at ?? null }
            );
            console.log(`AnaliseSolo ${a.id} inserida localmente!`);
        }
    }

    console.log('Sincronização de analises_solos concluída!');
}
