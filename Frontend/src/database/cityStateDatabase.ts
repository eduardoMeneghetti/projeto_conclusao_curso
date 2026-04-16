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
    latitude?: number;
    longitude?: number;
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

    async function getCityStateById(id: number) {
        try {
            const row = await database.getFirstAsync<CidadeDatabase>(
                `SELECT latitude, longitude FROM cidades WHERE id = $id`, { $id: id }
            );
            return row;
        } catch (error) {
            console.log("erro ao buscar cidade | estado por id", error);
            return null;
        }           
    }

    return { getCitiesStates, getCityStateById };
}