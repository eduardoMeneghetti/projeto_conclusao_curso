import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export type PropDatabase = {
    id: number,
    descricao: string,
    hectare: number,
    cidade_id: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    ativo: boolean,
    server_id: number | null,
    deleted_at: string | null
}

type PropDatabaseRaw = Omit<PropDatabase, "ativo" | "is_dirty"> & {
    ativo: number,
    is_dirty: number
}

function mapProp(row: PropDatabaseRaw): PropDatabase {
    return {
        ...row,
        ativo: row.ativo == 1,
        is_dirty: row.is_dirty === 1
    };

}

export function usePropDatabase() {
    const database = useSQLiteContext();

    async function getProprety() {
        try {
            const rows = await database.getAllAsync<PropDatabaseRaw>(
                'SELECT * FROM  propriedades WHERE ativo == 1 AND  deleted_at IS NULL'
            )
            return rows.map(mapProp)
        } catch (error) {
            console.error("Erro ao buscar propriedade:", error)
        }
    }

    async function getPropretyAll() {
        try {
            const rows = await database.getAllAsync<PropDatabaseRaw>(
                'SELECT * FROM  propriedades'
            )
            return rows.map(mapProp)
        } catch (error) {
            console.error("Erro ao buscar propriedade:", error)
        }
    }

    async function createProprety(data: Pick<PropDatabase, "descricao" | "cidade_id">) {

        const insert = await database.prepareAsync(`
            INSERT INTO propriedades (descricao, cidade_id, created_at, updated_at, is_dirty, ativo)
            VALUES ($descricao, $cidade_id, datetime('now'), datetime('now'), 1, 1) 
        `)

        try {
            const result = await insert.executeAsync({
                $descricao: data.descricao,
                $cidade_id: data.cidade_id
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            return {insertedRowId}
        } catch (error) {
            console.log("erro ao cadastrar usuario", error)
        }finally{
            await insert.finalizeAsync();
        }

        
    }
    

    return { getProprety, createProprety, getPropretyAll }
}