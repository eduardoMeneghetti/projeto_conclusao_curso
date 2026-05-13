import { useSQLiteContext } from "expo-sqlite"; 

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

type RecommendationItemDatabaseRaw = Omit<RecommendationItemDatabase, "is_dirty"> & {
    is_dirty: number;
}

function mapRecommendationItem(row: RecommendationItemDatabaseRaw): RecommendationItemDatabase {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    };
}

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
            console.log("Item de recomendação criado com ID: ", result)

            return { insertedRowId: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao criar item de recomendação: ", error);
            throw error;
        }

    }


    return {
        createRecommendationItem
    }

}
