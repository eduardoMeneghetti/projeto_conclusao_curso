import { useSQLiteContext } from "expo-sqlite";

export type UseHarverst = {
    id: number,
    descricao: string,
    data_inicio: string,
    data_final: string,
    ativo: boolean,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

type UseHarvestRaw = Omit<UseHarverst, "ativo" | "is_dirty"> & {
    ativo: number,
    is_dirty: number
}

function mapHarvest(row: UseHarvestRaw): UseHarverst {
    return {
        ...row,
        ativo: row.ativo == 1,
        is_dirty: row.is_dirty === 1
    };
}

export function useHarverstDatabase() {
    const database = useSQLiteContext();

    async function createHarvest(data: Pick<UseHarverst, "descricao" | "data_inicio" | "data_final">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO safras (descricao, data_inicio, data_final, created_at, updated_at, is_dirty, ativo)    
            VALUES ($descricao, $data_inicio, $data_final, datetime('now'), datetime('now'), 1, 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $descricao: data.descricao,
                $data_inicio: data.data_inicio,
                $data_final: data.data_final,
            })

            const insertRowId = result.lastInsertRowId.toLocaleString();

            return { insertRowId }
        } catch (error) {
            console.log("nao foi possivel cadastrar a safra: ", error)
        } finally {
            await sentece.finalizeAsync();
        }

    }

    async function getHarvest(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<UseHarvestRaw>(
                `SELECT s.* 
                 FROM safras s
                 INNER JOIN atividade_safras ats ON ats.safra_id  = s.id
                 INNER JOIN propriedades p ON ats.propriedade_id = p.id
                 WHERE ats.propriedade_id = $propriedade_id 
                 AND s.ativo = 1`,
                { $propriedade_id: propriedade_id } 
            )
            return rows.map(mapHarvest)
        } catch (error) {
            console.error("Erro ao buscar safras: ", error)
            return []
        }
    }

    async function getHarvestAll(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<UseHarvestRaw>(
                `SELECT s.* 
                 FROM safras s
                 INNER JOIN atividade_safras ats ON ats.safra_id  = s.id
                 INNER JOIN propriedades p ON ats.propriedade_id = p.id
                 WHERE ats.propriedade_id = $propriedade_id `,
                 { $propriedade_id: propriedade_id } 
            )
            return rows.map(mapHarvest)
        } catch (error) {
            console.error("Erro ao buscar safra: ", error)
            return [ ]
        }
    }

    async function getHarvestById(id: string) {
        try {
            const row = await database.getFirstAsync<UseHarvestRaw>(
                `SELECT *
                FROM safras s
                INNER JOIN atividade_safras ats ON ats.safra_id = s.id 
                WHERE s.id = $id`,
                { $id: id }
            )

            return row ? mapHarvest(row) : null;
        } catch (error) {
            console.error("Erro ao buscar safra: ", error)
        }
    }

    async function updateHaverst(data: Pick<UseHarverst, "id" | "descricao" | "data_inicio" | "data_final" | "ativo">) {
        const sentence = await database.prepareAsync(`
        UPDATE safras 
        SET descricao = $descricao, 
            data_inicio = $data_inicio, 
            data_final = $data_final, 
            ativo = $ativo, 
            updated_at = datetime('now')
        WHERE id = $id
    `);

        try {
            await sentence.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $data_inicio: data.data_inicio,
                $data_final: data.data_final,
                $ativo: data.ativo ? 1 : 0,
            });
        } catch (error) {
            console.error("Erro ao atualizar safra", error);
        } finally {
            await sentence.finalizeAsync();
        }
    }

    return { createHarvest, getHarvest, getHarvestAll, getHarvestById, updateHaverst }
}