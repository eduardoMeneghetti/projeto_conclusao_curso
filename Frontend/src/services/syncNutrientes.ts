import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncNutrientes(database: SQLiteDatabase) {
    const token = await getToken();

    const nutrientes = await database.getAllAsync<{
        id: number;
        descricao: string;
        sigla: string;
        unidade: string;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM nutrientes WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('Nutrientes dirty:', nutrientes.length);

    if (nutrientes.length) {
        for (const nutriente of nutrientes) {
            if (nutriente.server_id) {
                const response = await fetch(`${API_URL}/nutrientes/${nutriente.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ nutriente: { descricao: nutriente.descricao, sigla: nutriente.sigla, unidade: nutriente.unidade } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE nutrientes SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: nutriente.id }
                    );
                    console.log(`Nutriente ${nutriente.descricao} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/nutrientes/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ nutrientes: [nutriente] })
                });
                const data = await response.json();
                if (data.nutrientes?.[0]) {
                    await database.runAsync(
                        `UPDATE nutrientes SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.nutrientes[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: nutriente.id }
                    );
                    console.log(`Nutriente ${nutriente.descricao} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM nutrientes`);
    const url = ultimaSync?.synced_at ? `${API_URL}/nutrientes?updated_after=${ultimaSync.synced_at}` : `${API_URL}/nutrientes`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const nutrientesServidor = Array.isArray(rawData) ? rawData : rawData.nutrientes;

    for (const n of nutrientesServidor ?? []) {
        const existeLocal = await database.getFirstAsync(`SELECT id FROM nutrientes WHERE server_id = $server_id`, { $server_id: n.id });
        if (existeLocal) {
            await database.runAsync(
                `UPDATE nutrientes SET descricao = $descricao, sigla = $sigla, unidade = $unidade, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $descricao: n.descricao, $sigla: n.sigla, $unidade: n.unidade, $updated_at: n.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: n.id }
            );
            console.log(`Nutriente ${n.descricao} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO nutrientes (descricao, sigla, unidade, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($descricao, $sigla, $unidade, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $descricao: n.descricao, $sigla: n.sigla, $unidade: n.unidade, $server_id: n.id, $created_at: n.created_at, $updated_at: n.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`Nutriente ${n.descricao} inserido localmente!`);
        }
    }

    console.log('Sincronização de nutrientes concluída!');
}