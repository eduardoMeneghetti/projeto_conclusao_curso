import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncPropriedades(database: SQLiteDatabase) {

    const token = await getToken();

    const propriedades = await database.getAllAsync<{
        id: number,
        descricao: string,
        hectare: number,
        cidade_id: number,
        created_at: string,
        updated_at: string,
        synced_at: string | null,
        is_dirty: number,
        ativo: number,
        server_id: number | null,
        deleted_at: string | null
    }>('SELECT * FROM propriedades WHERE is_dirty = 1 ORDER BY updated_at ASC');

    console.log('propriedades dirty:', propriedades.length);

    if (propriedades.length) {
        const propriedadesComServerCidade = await Promise.all(
            propriedades.map(async (propriedade) => {
                const cidade = await database.getFirstAsync<{ server_id: number }>(
                    `SELECT server_id FROM cidades WHERE id = $id`,
                    { $id: propriedade.cidade_id }
                );
                return {
                    ...propriedade,
                    cidade_id: cidade?.server_id
                };
            })
        );

        for (const propriedade of propriedadesComServerCidade) {

            if (propriedade.server_id) {
                console.log(`Atualizando propriedade ${propriedade.descricao} no servidor...`);

                const response = await fetch(`${API_URL}/propriedades/${propriedade.server_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        propriedade: {
                            descricao: propriedade.descricao,
                            hectare: propriedade.hectare,
                            cidade_id: propriedade.cidade_id,
                            ativo: propriedade.ativo
                        }
                    })
                });

                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE propriedades 
                         SET synced_at = $synced_at, is_dirty = 0
                         WHERE id = $id`,
                        {
                            $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                            $id: propriedade.id
                        }
                    );
                    console.log(`Propriedade ${propriedade.descricao} atualizada no servidor!`);
                }

            } else {
                console.log(`Criando propriedade ${propriedade.descricao} no servidor...`);

                const response = await fetch(`${API_URL}/propriedades/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ propriedades: [propriedade] })
                });

                const data = await response.json();

                if (data.propriedades?.[0]) {
                    await database.runAsync(
                        `UPDATE propriedades
                         SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0
                         WHERE id = $id`,
                        {
                            $server_id: data.propriedades[0].id,
                            $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                            $id: propriedade.id
                        }
                    );
                    console.log(`Propriedade ${propriedade.descricao} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(
        `SELECT MAX(synced_at) as synced_at FROM propriedades`
    );

    const url = ultimaSync?.synced_at
        ? `${API_URL}/propriedades?updated_after=${ultimaSync.synced_at}`
        : `${API_URL}/propriedades`;

    const responseGet = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const rowData = await responseGet.json();
    const propriedadesServidor = Array.isArray(rowData) ? rowData : rowData.propriedades;

    console.log('Propriedades recebidas do servidor:', propriedadesServidor?.length);

    for (const p of propriedadesServidor ?? []) {

        const cidadeLocal = await database.getFirstAsync<{ id: number }>(
            `SELECT id FROM cidades WHERE server_id = $server_id`,
            { $server_id: p.cidade_id }
        );

        const existeLocal = await database.getFirstAsync(
            `SELECT id FROM propriedades WHERE server_id = $server_id`,
            { $server_id: p.id }
        );

        if (existeLocal) {

            if (!cidadeLocal) {
                console.log(`Cidade não encontrada localmente para server_id: ${p.cidade_id}`);
                continue;  
            }

            await database.runAsync(
                `UPDATE propriedades
                 SET descricao = $descricao,
                     hectare = $hectare,
                     cidade_id = $cidade_id,
                     ativo = $ativo,
                     updated_at = $updated_at,
                     synced_at = $synced_at,
                     is_dirty = 0
                 WHERE server_id = $server_id`,
                {
                    $descricao: p.descricao,
                    $hectare: p.hectare,
                    $cidade_id: cidadeLocal?.id,
                    $ativo: p.ativo ? 1 : 0,
                    $updated_at: p.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: p.id
                }
            );
            console.log(`Propriedade ${p.descricao} atualizada localmente!`);

        } else {

             if (!cidadeLocal) {
                console.log(`Cidade não encontrada localmente para server_id: ${p.cidade_id}`);
                continue;  
            }

            await database.runAsync(
                `INSERT INTO propriedades 
                 (descricao, hectare, cidade_id, server_id, created_at, updated_at, synced_at, is_dirty, ativo)
                 VALUES ($descricao, $hectare, $cidade_id, $server_id, $created_at, $updated_at, $synced_at, 0, $ativo)`,
                {
                    $descricao: p.descricao,
                    $hectare: p.hectare,
                    $cidade_id: cidadeLocal?.id,
                    $server_id: p.id,
                    $created_at: p.created_at,
                    $updated_at: p.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $ativo: p.ativo ? 1 : 0
                }
            );
            console.log(`Propriedade ${p.descricao} criada localmente!`);
        }
    }

    console.log('Sincronização de propriedades encerrada com sucesso!');
}