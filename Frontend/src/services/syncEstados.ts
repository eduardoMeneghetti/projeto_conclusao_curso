import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncEstados(database: SQLiteDatabase) {
    const token = await getToken();

    const estados = await database.getAllAsync<{
        id: number,
        descricao: string,
        sigla: string,
        codigo_ibge: string,
    }>(`SELECT * FROM estados WHERE server_id IS NULL`);

    console.log('Estados para sincronizar:', estados.length);

    if (!estados.length) {
        console.log('Todos os estados já sincronizados!');
        return;
    }

    const response = await fetch(`${API_URL}/estados/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estados })
    });

    const data = await response.json();

    for (const estado of data.estados ?? []) {
        await database.runAsync(
            `UPDATE estados
             SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0
             WHERE id = $id`,
            {
                $server_id: estado.id,
                $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                $id: estado.local_id
            }
        );
    }

    console.log('Estados sincronizados!');
}