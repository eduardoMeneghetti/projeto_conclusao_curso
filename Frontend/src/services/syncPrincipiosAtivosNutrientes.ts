import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncPrincipiosAtivosNutrientes(database: SQLiteDatabase) {
    const token = await getToken();

    const itens = await database.getAllAsync<{
        id: number;
        principios_ativo_id: number;
        nutriente_id: number;
        percentual: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM principios_ativos_nutrientes WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('PrincipiosAtivosNutrientes dirty:', itens.length);

    if (itens.length) {
        const itensComIds = await Promise.all(
            itens.map(async (item) => {
                const [principioAtivo, nutriente] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM principios_ativos WHERE id = $id`,
                        { $id: item.principios_ativo_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM nutrientes WHERE id = $id`,
                        { $id: item.nutriente_id }
                    ),
                ]);
                return {
                    ...item,
                    principios_ativo_id: principioAtivo?.server_id,
                    nutriente_id: nutriente?.server_id,
                };
            })
        );

        for (const item of itensComIds) {
            if (item.server_id) {
                const response = await fetch(`${API_URL}/principios_ativos_nutrientes/${item.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ principio_ativo_nutriente: { principios_ativo_id: item.principios_ativo_id, nutriente_id: item.nutriente_id, percentual: item.percentual, deleted_at: item.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE principios_ativos_nutrientes SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: item.id }
                    );
                    console.log(`PrincipioAtivoNutriente ${item.id} atualizado no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/principios_ativos_nutrientes/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ principios_ativos_nutrientes: [item] })
                });
                const data = await response.json();
                if (data.principios_ativos_nutrientes?.[0]) {
                    await database.runAsync(
                        `UPDATE principios_ativos_nutrientes SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.principios_ativos_nutrientes[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: item.id }
                    );
                    console.log(`PrincipioAtivoNutriente ${item.id} criado no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM principios_ativos_nutrientes`);
    const url = ultimaSync?.synced_at ? `${API_URL}/principios_ativos_nutrientes?updated_after=${ultimaSync.synced_at}` : `${API_URL}/principios_ativos_nutrientes`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const itensServidor = Array.isArray(rawData) ? rawData : rawData.principios_ativos_nutrientes;

    for (const item of itensServidor ?? []) {
        const [principioAtivoLocal, nutrienteLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM principios_ativos WHERE server_id = $server_id`, { $server_id: item.principios_ativo_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM nutrientes WHERE server_id = $server_id`, { $server_id: item.nutriente_id }),
            database.getFirstAsync(`SELECT id FROM principios_ativos_nutrientes WHERE server_id = $server_id`, { $server_id: item.id }),
        ]);

        if (!principioAtivoLocal) {
            console.log(`PrincipioAtivo não localizado para server_id: ${item.principios_ativo_id}`);
            continue;
        }
        if (!nutrienteLocal) {
            console.log(`Nutriente não localizado para server_id: ${item.nutriente_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE principios_ativos_nutrientes SET principios_ativo_id = $principios_ativo_id, nutriente_id = $nutriente_id, percentual = $percentual, deleted_at = CASE WHEN deleted_at IS NOT NULL AND $deleted_at IS NULL THEN deleted_at ELSE $deleted_at END, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id AND is_dirty = 0`,
                { $principios_ativo_id: principioAtivoLocal.id, $nutriente_id: nutrienteLocal.id, $percentual: item.percentual, $deleted_at: item.deleted_at ?? null, $updated_at: item.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: item.id }
            );
            console.log(`PrincipioAtivoNutriente ${item.id} atualizado localmente!`);
        } else if (!item.deleted_at) {
            await database.runAsync(
                `INSERT INTO principios_ativos_nutrientes (principios_ativo_id, nutriente_id, percentual, server_id, created_at, updated_at, synced_at, is_dirty) VALUES ($principios_ativo_id, $nutriente_id, $percentual, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                { $principios_ativo_id: principioAtivoLocal.id, $nutriente_id: nutrienteLocal.id, $percentual: item.percentual, $server_id: item.id, $created_at: item.created_at, $updated_at: item.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0] }
            );
            console.log(`PrincipioAtivoNutriente ${item.id} inserido localmente!`);
        }
    }

    console.log('Sincronização de principios_ativos_nutrientes concluída!');
}
