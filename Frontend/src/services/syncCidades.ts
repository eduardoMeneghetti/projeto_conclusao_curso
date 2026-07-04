import { SQLiteDatabase } from 'expo-sqlite';
import { API_URL } from './api';
import { getToken } from './auth';

export async function syncCidades(database: SQLiteDatabase) {
    const token = await getToken();

    const count = await database.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM cidades WHERE server_id IS NOT NULL`
    );

    if ((count?.count ?? 0) > 0) {
        console.log('Cidades já sincronizadas!');
        return;
    }

    console.log('Buscando cidades do servidor...');

    const response = await fetch(`${API_URL}/cidades`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    const cidades = Array.isArray(data) ? data : data.cidades;

    const now = new Date().toISOString().replace('T', ' ').split('.')[0];

    for (const c of cidades ?? []) {
        const localEstado = await database.getFirstAsync<{ id: number }>(
            `SELECT id FROM estados WHERE server_id = $server_id`,
            { $server_id: c.estado_id }
        );

        if (!localEstado) continue;

        await database.runAsync(
            `INSERT OR IGNORE INTO cidades (descricao, codigo_ibge, latitude, longitude, estado_id, server_id, created_at, updated_at, synced_at, is_dirty)
             VALUES ($descricao, $codigo_ibge, $latitude, $longitude, $estado_id, $server_id, $created_at, $updated_at, $synced_at, 0)`,
            {
                $descricao: c.descricao,
                $codigo_ibge: c.codigo_ibge ?? null,
                $latitude: c.latitude ?? 0,
                $longitude: c.longitude ?? 0,
                $estado_id: localEstado.id,
                $server_id: c.id,
                $created_at: c.created_at ?? now,
                $updated_at: c.updated_at ?? now,
                $synced_at: now
            }
        );
    }

    console.log('Cidades sincronizadas!');
}
