import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAtividades(database: SQLiteDatabase) {

    const token = await getToken();

    const atividades = await database.getAllAsync<{
        id: number,
        descricao: string,
        cor: string,
        ativo: boolean,
        created_at: string,
        updated_at: string,
        synced_at: string | null,
        is_dirty: boolean,
        server_id: number | null,
        deleted_at: string | null
    }>('SELECT * FROM atividades WHERE is_dirty = 1 ORDER BY updated_at ASC');

    console.log('atividades dirty: ', atividades.length);

    for (const atividade of atividades) {
        if (atividade.server_id) {
            console.log(`Atualizando atividade ${atividade.descricao} no servidor...`);

            const response = await fetch(`${API_URL}/atividades/${atividade.server_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    atividade: {
                        descricao: atividade.descricao,
                        cor: atividade.cor,
                        ativo: atividade.ativo
                    }
                })
            });

            if (response.status === 200) {
                await database.runAsync(
                    `UPDATE atividades
                     SET is_dirty = 0, synced_at = $synced_at
                     WHERE id = $id
                    `,
                    {
                        $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                        $id: atividade.id
                    }
                );
                console.log(`Atividade ${atividade.descricao} atualizada no servidor!`)
            }
        } else {
            console.log(`Criando nova atividade ${atividade.descricao} no servidor...`)

            const response = await fetch(`${API_URL}/atividades/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ atividades: [atividade] })
            });

            const data = await response.json();

            if (data.atividades?.[0]) {
                await database.runAsync(`
                   UPDATE atividades
                   SET is_dirty = 0, synced_at = $synced_at, server_id = $server_id
                   WHERE id = $id 
                `,
                    {
                        $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                        $id: atividade.id,
                        $server_id: data.atividades[0].id
                    })
            }
        }
    }

    console.log('Buscando atualizações no servidor....')

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(
        `SELECT MAX(synced_at) as synced_at FROM atividades`
    );

    const url = ultimaSync?.synced_at
        ? `${API_URL}/atividades?updated_after=${ultimaSync.synced_at}`
        : `${API_URL}/atividades`;

    const responseGet = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const rowData = await responseGet.json();
    const atividadesServidor = Array.isArray(rowData) ? rowData : rowData.atividades;

    for (const a of atividadesServidor ?? []) {

        const existeLocal = await database.getFirstAsync(
            `SELECT id FROM atividades WHERE server_id = $server_id`,
            { $server_id: a.id }
        )

        if (existeLocal) {
            await database.runAsync(
                `UPDATE atividades 
                SET descricao = $descricao, 
                cor = $cor, 
                ativo = $ativo, 
                updated_at = $updated_at,
                synced_at = $synced_at,
                is_dirty = 0
                WHERE server_id = $server_id`,
                {
                    $descricao: a.descricao,
                    $cor: a.cor,
                    $ativo: a.ativo ? 1 : 0,
                    $updated_at: a.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: a.id
                }
            );
        } else {
            await database.runAsync(
                `
                 INSERT INTO atividades (descricao, cor, server_id, created_at, updated_at, synced_at, is_dirty, ativo)
                 VALUES ($descricao, $cor, $server_id, $created_at, $updated_at, $synced_at, 0, $ativo)
                `,
                {
                    $descricao: a.descricao,
                    $cor: a.cor,
                    $ativo: a.ativo ? 1 : 0,
                    $created_at: a.updated_at,
                    $updated_at: a.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: a.id
                }
            );
            console.log(`Atividade ${a.descricao} criada localmente!`)
        }
    }
    console.log('Sincronização de atividade encerrada com sucesso!')
}