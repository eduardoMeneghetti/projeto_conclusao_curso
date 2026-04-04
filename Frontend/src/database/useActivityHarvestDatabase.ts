import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export type UseActivityHarvest = {
    id: number,
    atividade_id: number,
    safra_id: number,
    propriedade_id: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null,
}

type UseActivityHarvestRaw = Omit<UseActivityHarvest, "is_dirty"> & {
    is_dirty: number;
}

function mapActivityHarvest(row: UseActivityHarvestRaw): UseActivityHarvest {
    return {
        ...row,
        is_dirty: row.is_dirty == 1
    }
}

export function UseActivityHarvestDatabase() {
    const database = useSQLiteContext();

    async function createActivityHarvest(data: Pick<UseActivityHarvestRaw, "atividade_id" | "safra_id" | "propriedade_id">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO atividade_safras (atividade_id, safra_id, propriedade_id, created_at, updated_at, is_dirty)
            VALUES ($atividade_id, $safra_id, $propriedade_id, datetime('now'), datetime('now'), 1)
        `);

        try {
            const result = await sentece.executeAsync({
                $atividade_id: data.atividade_id,
                $safra_id: data.safra_id,
                $propriedade_id: data.propriedade_id
            })

            console.log("Suceso atividade_safra cadastrada: id ", result.lastInsertRowId)

            return { insertRowId: result.lastInsertRowId }
        } catch (error) {
            console.error('Erro ao criar atividade_safra ', error)
        } finally {
            await sentece.finalizeAsync();
        }

    }

    async function getActivityHarvestById(id: number) {
        try {
            const row = await database.getFirstAsync<UseActivityHarvestRaw>(
                `SELECT *
                 FROM atividade_safras ats 
                 INNER JOIN safras s ON s.id = ats.safra_id
                 WHERE s.id = $id
                   AND ats.deleted_at IS NULL`,
                { $id: id }
            );
            return row ? mapActivityHarvest(row) : null;
        } catch (error) {
            console.error("Erro ao buscar atividade_safra:", error);
            return null;
        }
    }

    async function getActivityHarvestByPropriety(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<UseActivityHarvest>(`
            SELECT 
                ats.id as atividade_safra_id,
                s.descricao as safra_descricao,
                a.descricao as atividade_descricao,
                a.id as atividade_id,
                s.id as safra_id,
                s.ativo 
            FROM atividade_safras ats
            INNER JOIN safras s ON s.id = ats.safra_id
            INNER JOIN atividades a ON a.id = ats.atividade_id
            WHERE ats.propriedade_id = $propriedade_id
            AND ats.deleted_at IS NULL
        `, { $propriedade_id: propriedade_id });
            return rows;
        } catch (error) {
            console.error("Erro ao buscar atividades da safra:", error);
            return [];
        }
    }

    async function updateActivityHarvestById(data: Pick<UseActivityHarvestRaw, "safra_id" | "atividade_id">) {

        const sentece = await database.prepareAsync(`
            UPDATE atividade_safras
            SET 
            atividade_id = $atividade_id,
            is_dirty = 1
            WHERE safra_id = $safra_id
        `)

        try {
            await sentece.executeAsync({
                $safra_id: data.safra_id,
                $atividade_id: data.atividade_id
            });
            console.log('estamos no update')
        } catch (error) {
            console.error('erro ao atualizar Registro ', error)
        } finally {
            await sentece.finalizeAsync();
        }
    }

    return { createActivityHarvest, getActivityHarvestById, updateActivityHarvestById, getActivityHarvestByPropriety }
}