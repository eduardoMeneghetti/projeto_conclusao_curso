import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncEstados(database: SQLiteDatabase) {
    const token = await getToken();

    const count = await database.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM estados WHERE server_id IS NOT NULL`
    );

    if ((count?.count ?? 0) > 0) {
        console.log('Estados já sincronizados!');
        return;
    }

    console.log('Buscando estados do servidor...');

    const response = await fetch(`${API_URL}/estados`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    const estados = Array.isArray(data) ? data : data.estados;

    const now = new Date().toISOString().replace('T', ' ').split('.')[0];

    for (const e of estados ?? []) {
        await database.runAsync(
            `INSERT OR IGNORE INTO estados (descricao, codigo_ibge, sigla, server_id, created_at, updated_at, synced_at, is_dirty)
             VALUES ($descricao, $codigo_ibge, $sigla, $server_id, $created_at, $updated_at, $synced_at, 0)`,
            {
                $descricao: e.descricao,
                $codigo_ibge: e.codigo_ibge,
                $sigla: e.sigla,
                $server_id: e.id,
                $created_at: e.created_at ?? now,
                $updated_at: e.updated_at ?? now,
                $synced_at: now
            }
        );
    }

    console.log(`Estados sincronizados: ${estados?.length ?? 0}`);
}
