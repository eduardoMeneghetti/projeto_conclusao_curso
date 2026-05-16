import { useSQLiteContext } from "expo-sqlite";
import { RecomendacaoItem } from "../components/AddItemForm";

export type RecommendationItemDatabase = {
    id: number;
    recomendacao_agricola_id: number;
    insumo_id: number;
    quantidade: number;
    dose: number;
    created_at: string;
    updated_at: string;
    server_id: number | null;
    deleted_at: string | null;
    synced_at: string | null;
    is_dirty: boolean;
};



export function useRecommendationItensDatabase() {
    const database = useSQLiteContext();

    async function createRecommendationItem(data: Pick<RecommendationItemDatabase, "recomendacao_agricola_id" | "insumo_id" | "quantidade" | "dose">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO recomendacoes_agricolas_itens (recomendacao_agricola_id, insumo_id, quantidade, dose, created_at, updated_at, is_dirty)
            VALUES ($recomendacao_agricola_id, $insumo_id, $quantidade, $dose, datetime('now'), datetime('now'), 1)`
        )

        try {
            const result = await sentece.executeAsync({
                $recomendacao_agricola_id: data.recomendacao_agricola_id,
                $insumo_id: data.insumo_id,
                $quantidade: data.quantidade,
                $dose: data.dose,
            })
            return { insertedRowId: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao criar item de recomendação: ", error);
            throw error;
        }
    }

    async function updateRecommendationItem(data: Pick<RecommendationItemDatabase, "id" | "recomendacao_agricola_id" | "insumo_id" | "quantidade" | "dose">) {
        const sentece = await database.prepareAsync(`
            UPDATE recomendacoes_agricolas_itens
            SET recomendacao_agricola_id = $recomendacao_agricola_id,
                insumo_id = $insumo_id,
                quantidade = $quantidade,
                dose = $dose,
                updated_at = datetime('now'),
                is_dirty = 1
            WHERE id = $id`
        )

        try {
            const result = await sentece.executeAsync({
                $id: data.id,
                $recomendacao_agricola_id: data.recomendacao_agricola_id,
                $insumo_id: data.insumo_id,
                $quantidade: data.quantidade,
                $dose: data.dose,
            })
            return { updatedRowId: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao atualizar item de recomendação: ", error);
            throw error;
        }
    }

    async function getItemsByRecommendationId(recomendacao_id: number): Promise<RecomendacaoItem[]> {
        try {
            const rows = await database.getAllAsync<RecomendacaoItem>(`
                SELECT
                    rai.insumo_id,
                    i.descricao,
                    rai.quantidade,
                    rai.dose,
                    um.sigla AS unidade
                FROM recomendacoes_agricolas_itens rai
                INNER JOIN insumos i ON i.id = rai.insumo_id
                INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
                WHERE rai.recomendacao_agricola_id = $recomendacao_id
                AND rai.deleted_at IS NULL
            `, { $recomendacao_id: recomendacao_id });
            return rows;
        } catch (error) {
            console.error("Erro ao buscar itens da recomendação: ", error);
            return [];
        }
    }

    async function deleteItemsByRecommendationId(recomendacao_id: number) {
        try {
            await database.runAsync(
                `DELETE FROM recomendacoes_agricolas_itens WHERE recomendacao_agricola_id = $recomendacao_id`,
                { $recomendacao_id: recomendacao_id }
            );
        } catch (error) {
            console.error("Erro ao deletar itens da recomendação: ", error);
            throw error;
        }
    }

    return {
        createRecommendationItem,
        updateRecommendationItem,
        getItemsByRecommendationId,
        deleteItemsByRecommendationId,
    }
}
