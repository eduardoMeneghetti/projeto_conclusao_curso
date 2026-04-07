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


    async function getPropretyById(id: string) {
        try {
            const row = await database.getFirstAsync<PropDatabaseRaw>(
                `SELECT * FROM propriedades WHERE id = $id`,
                { $id: id }
            );
            return row ? mapProp(row) : null;
        } catch (error) {
            console.log("erro ao buscar propriedade", error);
            return null;
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

            return { insertedRowId }
        } catch (error) {
            console.log("erro ao cadastrar propriedade", error)
        } finally {
            await insert.finalizeAsync();
        }


    }

    async function update(data: Pick<PropDatabase, "id" | "descricao" | "cidade_id" | "ativo" | "updated_at">) {

        const insert = await database.prepareAsync(`
            UPDATE propriedades SET descricao = $descricao, cidade_id = $cidade_id, ativo = $ativo, updated_at = datetime('now'), is_dirty = 1
            WHERE id = $id
        `)

        try {
            await insert.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $cidade_id: data.cidade_id,
                $ativo: data.ativo ? 1 : 0,
            })

        } catch (error) {
            console.log("erro ao atualizar propriedade", error)
        } finally {
            await insert.finalizeAsync();
        }


    }

    async function updateAreaPropriety(propriedade_id: number) {
        const sentece = await database.prepareAsync(
            `UPDATE propriedades p1
            SET hectare = (SELECT SUM(g.area_hectares)
            FROM propriedades p 
            INNER JOIN glebas g ON p.id = g.propriedade_id
            WHERE p.id = $id AND p.ativo = 1), is_dirty = 1, updated_at = datetime('now')
            WHERE p1.id = $id `,
        )
        try {
            await sentece.executeAsync({ $id: propriedade_id })
        } catch (error) {
            console.log("Erro ao atualizar área da propriedade", error)
        } finally {
            await sentece.finalizeAsync();
        }
    }



    return { getProprety, createProprety, getPropretyAll, getPropretyById, update, updateAreaPropriety}
}