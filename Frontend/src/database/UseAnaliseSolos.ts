import { useSQLiteContext } from "expo-sqlite";

export type UseAnaliseSolo = {
    id: number,
    atividade_gleba_id: number,
    atividade_safra_id: number,
    data_coleta: string,
    ativo: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

export type UseAnaliseClassificacao = {
    classificacao: string
}

type useAnaliseSoloRaw = Omit<UseAnaliseSolo, "is_dirty"> & {
    is_dirty: number
}

function mapUseAnalise(row: useAnaliseSoloRaw): UseAnaliseSolo {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    }
}

export function UseAnaliseSolos() {
    const database = useSQLiteContext();

    async function createAnaliseSolo(data: Pick<useAnaliseSoloRaw, "atividade_gleba_id" | "atividade_safra_id" | "data_coleta">) {
        const sentece = await database.prepareAsync(`
            INSERT INTO analises_solos(atividade_gleba_id, atividade_safra_id, data_coleta, created_at, updated_at, ativo, is_dirty)
            VALUES ($atividade_gleba_id, $atividade_safra_id, $data_coleta, datetime('now'), datetime('now'), 1, 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $atividade_gleba_id: data.atividade_gleba_id,
                $atividade_safra_id: data.atividade_safra_id,
                $data_coleta: data.data_coleta
            })
            console.log('Analise de Solo criada com sucesso: ', result)
            const insertedRowId = result.lastInsertRowId;
            return { insertedRowId }
        } catch (error) {
            console.error('Erro ao cadastrar analise de solo', error)
            throw error
        } finally {
            await sentece.finalizeAsync();
        }
    }

    return {
        createAnaliseSolo,

    }
}