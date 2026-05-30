import { useSQLiteContext } from "expo-sqlite";

export type useAplicacoes = {
    id: number;
    aplicacoes_insumo_id: number;
    insumo_id: number;
    quantidade_aplic: number;
    dose_aplic: number;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_dirty: boolean;
    server_id: number | null;
    deleted_at: string | null;
}

type useAplicacoesRaw = Omit<useAplicacoes, "is_dirty"> & {
    is_dirty: number;
}

function mapAplicacoes(row: useAplicacoesRaw): useAplicacoes {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    }
}

export function useAplicacoesItensDatabase() {
    const database = useSQLiteContext();

    async function createAplicacaoItem(data: Pick<useAplicacoes, "aplicacoes_insumo_id" | "insumo_id" | "quantidade_aplic" | "dose_aplic">) {
        const sentence = await database.prepareAsync(`
            INSERT INTO aplicacoes_itens_insumos (aplicacoes_insumo_id, insumo_id, quantidade_aplic, dose_aplic, created_at, updated_at, is_dirty)
            VALUES ($aplicacoes_insumo_id, $insumo_id, $quantidade_aplic, $dose_aplic, datetime('now'), datetime('now'), 1) 
        `)

        try {
            const result = await sentence.executeAsync({
                $aplicacoes_insumo_id: data.aplicacoes_insumo_id,
                $insumo_id: data.insumo_id,
                $quantidade_aplic: data.quantidade_aplic,
                $dose_aplic: data.dose_aplic
            })

            console.log("Aplicação item gerada com sucesso! :", result)

            return { insertRowId: result.lastInsertRowId }
        } catch (error) {
            console.error("Erro ao cadastrar item de aplicação: ", error)
            throw error
        } finally {
            await sentence.finalizeAsync();
        }
    }

    return {
        createAplicacaoItem
    }
}
