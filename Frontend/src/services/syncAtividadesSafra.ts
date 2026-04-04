import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAtividadeSafra(database: SQLiteDatabase) {

    const token = await getToken();

    const atividade_safras = await database.getAllAsync<{
        id: number,
        atividade_id: number,
        safra_id: number,
        propriedade_id: number,
        created_at: string,
        updated_at: string,
        synced_at: string | null,
        is_dirty: boolean,
        server_id: number | null,
        deleted_at: string | null,
    }>(`SELECT * FROM atividade_safras WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AtividadeSafra dirty', atividade_safras.length);

    if (atividade_safras.length) {
        const atividadesSafrasComIds = await Promise.all(
            atividade_safras.map(async (atividade_safra) => {

                const [propriedade, safra, atividade] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM propriedades WHERE id = $id`,
                        { $id: atividade_safra.propriedade_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM safras WHERE id = $id`,
                        { $id: atividade_safra.safra_id }
                    ),
                    database.getFirstAsync<{ server_id: number }>(
                        `SELECT server_id FROM atividades WHERE id = $id`,
                        { $id: atividade_safra.atividade_id }
                    ),
                ]);

                return {
                    ...atividade_safra,
                    propriedade_id: propriedade?.server_id,  
                    safra_id: safra?.server_id,              
                    atividade_id: atividade?.server_id      
                };
            })
        );

        for (const atividade_safra of atividadesSafrasComIds) {

            if (atividade_safra.server_id) {
                console.log(`Atualizando a atividade safra de id ${atividade_safra.id} no servidor...`);

                const response = await fetch(`${API_URL}/atividade_safras/${atividade_safra.server_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        atividade_safra: {
                            atividade_id: atividade_safra.atividade_id,
                            safra_id: atividade_safra.safra_id,
                            propriedade_id: atividade_safra.propriedade_id
                        }
                    })
                });

                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE atividade_safras
                        SET is_dirty = 0, synced_at = $synced_at
                        WHERE id = $id`,
                        {
                            $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                            $id: atividade_safra.id
                        }
                    );
                    console.log(`AtividadeSafra ${atividade_safra.id} atualizada no servidor com Sucesso!`)
                }
            } else {
                console.log(`Criando nova propriedade safra ${atividade_safra.id} no servidor....`)

                const response = await fetch(`${API_URL}/atividade_safras/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ atividade_safras: [atividade_safra] })
                })

                const data = await response.json();

                if (data.atividade_safras?.[0]) {
                    await database.runAsync(
                        `UPDATE atividade_safras
                        SET is_dirty = 0, synced_at = $synced_at, server_id = $server_id
                        WHERE id = $id`,
                        {
                            $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                            $id: atividade_safra.id,
                            $server_id: data.atividade_safras[0].id
                        }
                    );
                    console.log(`AtividadesSafras com id: ${atividade_safra.server_id} criada no servidor!`)
                }

            }

        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string}>(
        `SELECT MAX(synced_at) as synced_at FROM atividade_safras`
    );

    const url = ultimaSync?.synced_at
        ? `${API_URL}/atividade_safras?updated_after=${ultimaSync.synced_at}`
        : `${API_URL}/atividade_safras`

    const responseGet = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const rowData = await responseGet.json();
    const atividadeSafrasServidor = Array.isArray(rowData) ? rowData : rowData.atividade_safras;

    for (const a of atividadeSafrasServidor ?? []) {

        const [propriedadeLocal, safraLocal, atividadeLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(
                `SELECT id FROM propriedades WHERE server_id = $server_id`,
                { $server_id: a.propriedade_id }
            ),
            database.getFirstAsync<{ id: number }>(
                `SELECT id FROM safras WHERE server_id = $server_id`,
                { $server_id: a.safra_id }
            ),
            database.getFirstAsync<{ id: number }>( 
                `SELECT id FROM atividades WHERE server_id = $server_id`,
                { $server_id: a.atividade_id }
            ),
            database.getFirstAsync(  
                `SELECT id FROM atividade_safras WHERE server_id = $server_id`,
                { $server_id: a.id }
            ),
        ]);
        if (!propriedadeLocal) {
            console.log(`Propriedade não localizada para server_id: ${a.propriedade_id}`);
            continue;
        }
        if (!safraLocal) {
            console.log(`Safra não localizada para server_id: ${a.safra_id}`);
            continue;
        }
        if (!atividadeLocal) {
            console.log(`Atividade não localizada para server_id: ${a.atividade_id}`);
            continue;
        }

        if (existeLocal) {
            await database.runAsync(
                `UPDATE atividade_safras
                 SET atividade_id = $atividade_id,
                     safra_id = $safra_id,
                     propriedade_id = $propriedade_id,
                     updated_at = $updated_at,
                     synced_at = $synced_at,
                     is_dirty = 0  -- 👈 era 1, deve ser 0
                 WHERE server_id = $server_id`,
                {
                    $atividade_id: atividadeLocal.id,
                    $safra_id: safraLocal.id,
                    $propriedade_id: propriedadeLocal.id,
                    $updated_at: a.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: a.id
                }
            );
            console.log(`AtividadeSafra ${a.id} atualizada localmente!`);

        } else {
            // 👇 faltava o INSERT
            await database.runAsync(
                `INSERT INTO atividade_safras
                 (atividade_id, safra_id, propriedade_id, server_id, created_at, updated_at, synced_at, is_dirty)
                 VALUES ($atividade_id, $safra_id, $propriedade_id, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                {
                    $atividade_id: atividadeLocal.id,
                    $safra_id: safraLocal.id,
                    $propriedade_id: propriedadeLocal.id,
                    $server_id: a.id,
                    $created_at: a.created_at,
                    $updated_at: a.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                }
            );
            console.log(`AtividadeSafra ${a.id} inserida localmente!`);
        }
    }

    console.log('Sincronização de atividade_safras concluída!');

}