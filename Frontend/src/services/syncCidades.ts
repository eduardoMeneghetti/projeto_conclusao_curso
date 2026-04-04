// services/syncCidades.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { API_URL } from './api';
import { getToken } from './auth';

export async function syncCidades(database: SQLiteDatabase) {
    const token = await getToken();

    const cidades = await database.getAllAsync<{
        id: number,
        descricao: string,
        codigo_ibge: number,
        latitude: number,
        longitude: number,
        estado_id: number,
    }>(`SELECT * FROM cidades WHERE server_id IS NULL`);

    console.log('Cidades para sincronizar:', cidades.length);

    if (!cidades.length) {
        console.log('Todas as cidades já sincronizadas!');
        return;
    }

    const cidadesComServerEstado = await Promise.all(
        cidades.map(async (cidade) => {
            const estado = await database.getFirstAsync<{ server_id: number }>(
                `SELECT server_id FROM estados WHERE id = $id`,
                { $id: cidade.estado_id }
            );
            return {
                ...cidade,
                estado_id: estado?.server_id  // 👈 envia o server_id do estado
            };
        })
    );

    const response = await fetch(`${API_URL}/cidades/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cidades: cidadesComServerEstado })
    });

    const data = await response.json();

    for (const cidade of data.cidades ?? []) {
        await database.runAsync(
            `UPDATE cidades
             SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0
             WHERE id = $id`,
            {
                $server_id: cidade.id,
                $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                $id: cidade.local_id
            }
        );
    }

    console.log('Cidades sincronizadas!');
}