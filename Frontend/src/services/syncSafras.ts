import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncSafras(database: SQLiteDatabase) {

    const token = await getToken();

    const safras = await database.getAllAsync<{
        id: number,
        descricao: string,
        data_inicio: string,
        data_final: string,
        ativo: boolean,
        created_at: string,
        updated_at: string,
        synced_at: string | null,
        is_dirty: boolean,
        server_id: number | null,
        deleted_at: string | null
    }>('SELECT * FROM safras WHERE is_dirty = 1 ORDER BY updated_at ASC');

    console.log('Safras dirty: ', safras.length);

    for (const safra of safras) {

        if (safra.server_id) {
            console.log(`Atualizando safra ${safra.descricao} no servidor...`);

            const response = await fetch(`${API_URL}/safras/${safra.server_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    safra: {
                        descricao: safra.descricao,
                        data_inicio: safra.data_inicio,
                        data_final: safra.data_final,
                        ativo: safra.ativo
                    }
                })
            });

            if (response.status === 200) {
                await database.runAsync(
                    `UPDATE safras
                    SET synced_at = $synced_at, is_dirty = 1
                    WHERE id = $id`,
                    {
                        $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                        $id: safra.id
                    }
                );
                console.log(`Safra ${safra.descricao}, com o id ${safra.id} atualizada no servidor!`)
            }

        } else {
            console.log(`Criando nova propriedade ${safra.descricao} no servidor...`)

            const response = await fetch(`${API_URL}/safras/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ safras: [safra] })
            });

            const data = await response.json();

            if (data.safras?.[0]) {
                await database.runAsync(`
                UPDATE safras
                SET synced_at = $synced_at, is_dirty = 1, server_id = $server_id
                WHERE id = $id
                `, {
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $id: safra.id,
                    $server_id: data.safras[0].id
                })
            }

        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`
        SELECT MAX(synced_at) as synced_at FROM safras
    `);

    const url = ultimaSync?.synced_at
        ? `${API_URL}/safras?updated_after=${ultimaSync.synced_at}`
        : `${API_URL}/safras`;

    const responseGet = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const rowData = await responseGet.json();
    const safrasServidor = Array.isArray(rowData) ? rowData : rowData.safras;

    console.log('Safras recebidas do servidor:', safrasServidor?.length);

    for (const s of safrasServidor ?? []) {

        const existeLocal = await database.getFirstAsync(
            `SELECT id FROM safras WHERE server_id = $server_id`,
            { $server_id: s.id }
        );

        if (existeLocal) {
            await database.runAsync(
                `UPDATE safras 
                SET descricao = $descricao, 
                data_inicio = $data_inicio, 
                data_final = $data_final, 
                ativo = $ativo, 
                updated_at = $updated_at,
                synced_at = $synced_at,
                is_dirty = 0
                WHERE server_id = $server_id
                `,
                {
                    $descricao: s.descricao,
                    $data_inicio: s.data_inicio,
                    $data_final: s.data_final,
                    $updated_at: s.updated_at,
                    $ativo: s.ativo ? 1 : 0,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: s.id
                }
            );
            console.log(`Safras ${s.descricao} atualizado localmente!`);
        } else {
            await database.runAsync(
                ` INSERT INTO safras (descricao, data_inicio, data_final, server_id, created_at, updated_at, synced_at, is_dirty, ativo)    
                  VALUES ($descricao, $data_inicio, $data_final, $server_id, $created_at, $updated_at, $synced_at, 0, $ativo)`,
                {
                    $descricao: s.descricao,
                    $data_inicio: s.data_inicio,
                    $data_final: s.data_final,
                    $created_at: s.updated_at,
                    $updated_at: s.updated_at,
                    $ativo: s.ativo ? 1 : 0,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: s.id
                }
            );
            console.log(`Safras ${s.descricao} criada localmente!`);
        }
    }
    console.log('Sincronização de safras encerrada com sucesso!')
}