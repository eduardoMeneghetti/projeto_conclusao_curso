import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export type UseActivityHarvest = {
    safra_descricao: any;
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

export type GlebasInActivityHarvest = {
    atividade_gleba_id: number,
    gleba_id: number,
    descricao_gleba: string,
    area_hectares: number
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
                `SELECT 
                    ats.id,
                    ats.atividade_id,
                    ats.safra_id,
                    ats.propriedade_id,
                    ats.created_at,
                    ats.updated_at,
                    ats.synced_at,
                    ats.is_dirty,
                    ats.server_id,
                    ats.deleted_at,
                    s.descricao as safra_descricao
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
                ats.id as id,
                s.descricao as safra_descricao,
                a.descricao as atividade_descricao,
                a.id as atividade_id,
                s.id as safra_id,
                s.ativo 
            FROM atividade_safras ats
            INNER JOIN safras s ON s.id = ats.safra_id
            LEFT JOIN atividades a ON a.id = ats.atividade_id
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

    async function getGlebasInActivityHarvest(atividade_safra_id: number) {
        try {
            const rows = await database.getAllAsync<GlebasInActivityHarvest>(`
                SELECT
                ag.id AS atividade_gleba_id,
                g.id AS gleba_id,
                g.descricao AS descricao_gleba,
                g.area_hectares AS area_hectares
                FROM
                glebas g
                INNER JOIN atividade_glebas ag ON
                ag.gleba_id = g.id
                WHERE
                ag.atividade_safra_id = $atividade_safra_id
                AND ag.deleted_at IS NULL
            `, { $atividade_safra_id: atividade_safra_id });
            return rows;
        } catch (error) {
            console.error("Erro ao buscar glebas da atividade_safra:", error);
            return [];
        }
    }

    return { createActivityHarvest, getActivityHarvestById, updateActivityHarvestById, getActivityHarvestByPropriety, getGlebasInActivityHarvest }
}