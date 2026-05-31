import { useSQLiteContext } from "expo-sqlite";
import { AplicacaoItemLista } from "./useAplicacoesDatabase";

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

export type aplicacoesItens = {
    insumo_id: number;
    descricao: string;
    quantidade: number;
    dose: number;
    unidade: string;
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

    async function getAplicacaoItensByAplicacaoId(aplicacoes_insumo_id: number): Promise<aplicacoesItens[]> {
        try {
            const rows = await database.getAllAsync<aplicacoesItens>(`
                SELECT
                    aii.insumo_id,
                    i.descricao,
                    aii.quantidade_aplic as quantidade,
                    aii.dose_aplic as dose,
                    um.sigla AS unidade
                FROM aplicacoes_itens_insumos aii
                INNER JOIN insumos i ON i.id = aii.insumo_id
                INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
                WHERE aii.aplicacoes_insumo_id = $aplicacoes_insumo_id
                  AND aii.deleted_at IS NULL`,
                { $aplicacoes_insumo_id: aplicacoes_insumo_id }
            );

            return rows;
        } catch (error) {
            console.error("Erro ao buscar itens de aplicação: ", error);
            throw error;
        }
    }

    async function deleteItemByAplicacaoId(aplicacoes_insumo_id: number) {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync(
                    `UPDATE aplicacoes_itens_insumos
                    SET deleted_at = datetime('now'), is_dirty = 1
                    WHERE aplicacoes_insumo_id = $aplicacoes_insumo_id
                      AND deleted_at IS NULL`,
                    { $aplicacoes_insumo_id: aplicacoes_insumo_id }
                );

                await database.runAsync(`
                    UPDATE movimentacao_estoque_insumos
                    SET deleted_at = datetime('now'), is_dirty = 1
                    WHERE aplicacoes_insumo_id = $aplicacoes_insumo_id
                      AND deleted_at IS NULL`,
                    { $aplicacoes_insumo_id: aplicacoes_insumo_id }
                );
            });
        } catch (error) {
            console.error("Erro ao deletar itens de aplicação: ", error);
            throw error;
        }
    }

    return {
        createAplicacaoItem,
        getAplicacaoItensByAplicacaoId,
        deleteItemByAplicacaoId
    }

}
