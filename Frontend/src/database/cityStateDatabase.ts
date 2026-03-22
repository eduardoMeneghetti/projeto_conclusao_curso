import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import estados from '../assets/JSON/estados.json';
import cidades from '../assets/JSON/municipios.json';

export async function seedEstadosCidades(db: SQLiteDatabase) {

    const existe = await db.getFirstAsync(`
        SELECT * FROM estados LIMIT 1
        `)
    if (existe) return;

    for (const estado of estados) {
        await db.runAsync(`
            INSERT INTO estados (descricao, codigo_ibge, sigla, created_at, updated_at, is_dirty)
            VALUES ($descricao, $codigo_ibge, $sigla, datetime('now'), datetime('now'), 0)`,
            {
                $descricao: estado.nome, 
                $codigo_ibge: estado.codigo_uf,
                $sigla: estado.uf
            }
        );
    }

    for (const cidade of cidades) {

        const estado = await db.getFirstAsync<{ id: number }>(`
            SELECT id FROM estados WHERE codigo_ibge = $codigo_ibge`,
            {
                $codigo_ibge: cidade.codigo_uf
            }
        )

        if (!estado) continue;

        await db.runAsync(`
            INSERT INTO cidades (descricao, codigo_ibge, latitude, longitude, estado_id, created_at, updated_at, is_dirty)
            VALUES ($descricao, $codigo_ibge, $latitude, $longitude, $estado_id, datetime('now'), datetime('now'), 0)`,
            {
                $descricao: cidade.nome,
                $codigo_ibge: cidade.codigo_ibge,
                $latitude: cidade.latitude,
                $longitude: cidade.longitude,
                $estado_id: estado.id,
            }
        );
    }

}

export type CidadeDatabase = {
    id: number;
    descricao: string;
    sigla: string;
}

export function useCidadeDatabase() {
    const database = useSQLiteContext();

    async function getCitiesStates() {
        try {
            const rows = await database.getAllAsync<CidadeDatabase>(`
                SELECT c.id, c.descricao, e.sigla 
                FROM cidades c
                INNER JOIN estados e ON c.estado_id = e.id
                ORDER BY c.descricao, e.sigla
            `);
            return rows;
        } catch (error) {
            console.log("erro ao buscar cidades | estados", error);
            return [];
        }
    }

    return { getCitiesStates };
}