import { useSQLiteContext } from "expo-sqlite";

export type UseActivityGleba = {
    id: number,
    gleba_id: number,
    atividade_safra_id: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null,
}

type GlebaColor = {
    cor: string;
}

type UseActivityGlebaRaw = Omit<UseActivityGleba, "is_dirty"> & {
    is_dirty: number;
}

function mapActivityGleba(row: UseActivityGlebaRaw): UseActivityGleba {
    return {
        ...row,
        is_dirty: row.is_dirty == 1
    }
}

export function useActivityGlebaDatabase() {
    const database = useSQLiteContext();

    async function createActivityGleba(data: Pick<UseActivityGlebaRaw, "gleba_id" | "atividade_safra_id">) {

        const sentence = await database.prepareAsync(
            `INSERT INTO atividade_glebas(gleba_id, atividade_safra_id, created_at, updated_at, is_dirty)
            VALUES ($gleba_id, $atividade_safra_id, datetime('now'), datetime('now'), 1)`
        )

        try {
            const result = await sentence.executeAsync({
                $gleba_id: data.gleba_id,
                $atividade_safra_id: data.atividade_safra_id
            })

            console.log("Sucesso Atividade_Glebas cadastrado");

            return { insertRowId: result.lastInsertRowId }
        } catch (error) {
            console.error("Erro ao cadastrar nova atividade_safra", error)
            throw error
        } finally {
            sentence.finalizeAsync();
        }

    }

    async function getAtividadeGlebaAll() {
        try {
            const rows = await database.getAllAsync<UseActivityGlebaRaw>(`
                SELECT * FROM atividade_glebas WHERE deleted_at IS NUL
            `)

            return rows.map(mapActivityGleba);
        } catch (error) {
            console.error("Erro ao localizar todas as atividade_glebas, ", error)
            throw error
        }
    }

    async function getAtividadeGlebaById(id: number) {
        try {
            const row = await database.getFirstAsync<UseActivityGlebaRaw>(
                `SELECT * FROM atividade_glebas WEHERE id = $id`,
                { $id: id }
            )

            return row ? mapActivityGleba(row) : null
        } catch (error) {
            console.error("Erro ao localizar atividade_glebas pelo id, ", error)
            throw error
        }
    }

    async function getColorGlebaById(atividade_safra_id: number) {
        try {
            const row = await database.getFirstAsync<GlebaColor>(
                `SELECT a.cor  
            FROM atividade_glebas ag
            INNER JOIN atividade_safras ats ON ag.atividade_safra_id = ats.id
            INNER JOIN atividades a ON ats.atividade_id = a.id
            WHERE ag.atividade_safra_id = $id`,
                { $id: atividade_safra_id }
            );
            return row?.cor ?? null;
        } catch (error) {
            console.error("Erro ao localizar cor pelo id, ", error);
            return null;
        }
    }


    return { createActivityGleba, getAtividadeGlebaAll, getAtividadeGlebaById, getColorGlebaById }
}