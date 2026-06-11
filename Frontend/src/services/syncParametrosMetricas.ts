import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncParametrosMetricas(database: SQLiteDatabase) {
    const token = await getToken();

    const parametros = await database.getAllAsync<{
        id: number;
        tipo: string;
        descricao: string;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM parametros_metricas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('ParametrosMetricas dirty:', parametros.length);

    if (parametros.length) {
        for (const parametro of parametros) {
            if (parametro.server_id) {
                const response = await fetch(`${API_URL}/parametros_metricas/${parametro.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ parametro_metrica: { tipo: parametro.tipo, descricao: parametro.descricao } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE parametros_metricas SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: parametro.id }
                    );
                    console.log(`ParametroMetrica ${parametro.descricao} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/parametros_metricas/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ parametros_metricas: [parametro] })
                });
                const data = await response.json();
                if (data.parametros_metricas?.[0]) {
                    await database.runAsync(
                        `UPDATE parametros_metricas SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.parametros_metricas[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: parametro.id }
                    );
                    console.log(`ParametroMetrica ${parametro.descricao} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM parametros_metricas`);
    const url = ultimaSync?.synced_at ? `${API_URL}/parametros_metricas?updated_after=${ultimaSync.synced_at}` : `${API_URL}/parametros_metricas`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const parametrosServidor = Array.isArray(rawData) ? rawData : rawData.parametros_metricas;

    for (const p of parametrosServidor ?? []) {
        const existeLocal = await database.getFirstAsync(`SELECT id FROM parametros_metricas WHERE server_id = $server_id`, { $server_id: p.id });
        if (existeLocal) {
            await database.runAsync(
                `UPDATE parametros_metricas SET tipo = $tipo, descricao = $descricao, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $tipo: p.tipo, $descricao: p.descricao, $updated_at: p.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: p.id }
            );
            console.log(`ParametroMetrica ${p.descricao} atualizado localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO parametros_metricas (tipo, descricao, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($tipo, $descricao, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $tipo: p.tipo, $descricao: p.descricao, $server_id: p.id, $created_at: p.created_at, $updated_at: p.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`ParametroMetrica ${p.descricao} inserido localmente!`);
        }
    }

    console.log('Sincronização de parametros_metricas concluída!');
}