import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncUnidadesMedidas(database: SQLiteDatabase) {
    const token = await getToken();

    const unidades = await database.getAllAsync<{
        id: number;
        descricao: string;
        sigla: string;
        ativo: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM unidades_medidas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('UnidadesMedidas dirty:', unidades.length);

    if (unidades.length) {
        for (const unidade of unidades) {
            if (unidade.server_id) {
                const response = await fetch(`${API_URL}/unidades_medidas/${unidade.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ unidade_medida: { descricao: unidade.descricao, sigla: unidade.sigla, ativo: unidade.ativo, deleted_at: unidade.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE unidades_medidas SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: unidade.id }
                    );
                    console.log(`UnidadeMedida ${unidade.descricao} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/unidades_medidas/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ unidades_medidas: [unidade] })
                });
                const data = await response.json();
                if (data.unidades_medidas?.[0]) {
                    await database.runAsync(
                        `UPDATE unidades_medidas SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.unidades_medidas[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: unidade.id }
                    );
                    console.log(`UnidadeMedida ${unidade.descricao} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM unidades_medidas`);
    const url = ultimaSync?.synced_at ? `${API_URL}/unidades_medidas?updated_after=${ultimaSync.synced_at}` : `${API_URL}/unidades_medidas`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const unidadesServidor = Array.isArray(rawData) ? rawData : rawData.unidades_medidas;

    for (const u of unidadesServidor ?? []) {
        const existeLocal = await database.getFirstAsync(`SELECT id FROM unidades_medidas WHERE server_id = $server_id`, { $server_id: u.id });
        if (existeLocal) {
            await database.runAsync(
                `UPDATE unidades_medidas SET descricao = $descricao, sigla = $sigla, ativo = $ativo, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $descricao: u.descricao, $sigla: u.sigla, $ativo: u.ativo ? 1 : 0, $deleted_at: u.deleted_at ?? null, $updated_at: u.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: u.id }
            );
            console.log(`UnidadeMedida ${u.descricao} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO unidades_medidas (descricao, sigla, ativo, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($descricao, $sigla, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $descricao: u.descricao, $sigla: u.sigla, $ativo: u.ativo ? 1 : 0, $server_id: u.id, $created_at: u.created_at, $updated_at: u.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: u.deleted_at ?? null }
            );
            console.log(`UnidadeMedida ${u.descricao} inserida localmente!`);
        }
    }

    console.log('Sincronização de unidades_medidas concluída!');
}
