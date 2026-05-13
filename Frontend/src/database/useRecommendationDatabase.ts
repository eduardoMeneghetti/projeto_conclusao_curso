import { useSQLiteContext } from "expo-sqlite";
import { StatusRecomendacao } from '../util/statusRecomendacao';

export type RecommendationDatabase = {
    id: number;
    atividade_safra_id: number;
    atividade_gleba_id: number;
    analises_solo_id: number | null;
    data_recomendacao: string;
    operador_id: number;
    recomendante_id: number;
    area_aplic: number;
    status: StatusRecomendacao;
    ativo: boolean;
    created_at: string;
    updated_at: string;
    synced_at: string | null,
    is_dirty: boolean;
    server_id: number | null;
    deleted_at: string | null;
};

type RecommendationDatabaseRaw = Omit<RecommendationDatabase, "ativo" | "is_dirty"> & {
    ativo: number,
    is_dirty: number
}

function mapRecommendation(row: RecommendationDatabaseRaw): RecommendationDatabase {
    return {
        ...row,
        ativo: row.ativo == 1,
        is_dirty: row.is_dirty === 1
    };
}

export function useRecommendationDatabase() {
    const database = useSQLiteContext();

    async function createRecomendation(data: Pick<RecommendationDatabase, "atividade_safra_id" | "atividade_gleba_id" | "data_recomendacao" | "operador_id" | "recomendante_id" | "area_aplic">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO recomendacoes_agricolas (atividade_safra_id, atividade_gleba_id, data_recomendacao, operador_id, recomendante_id, area_aplic, status, created_at, updated_at, is_dirty, ativo)
            VALUES ($atividade_safra_id, $atividade_gleba_id, $data_recomendacao, $operador_id, $recomendante_id, $area_aplic, 'P', datetime('now'), datetime('now'), 1, 1)`
        )

        try {
            const result = await sentece.executeAsync({
                $atividade_safra_id: data.atividade_safra_id,
                $atividade_gleba_id: data.atividade_gleba_id,
                $data_recomendacao: data.data_recomendacao,
                $operador_id: data.operador_id,
                $recomendante_id: data.recomendante_id,
                $area_aplic: data.area_aplic,
            })
            console.log("Recomendação criada com ID: ", result)
            
            return { insertedRowI: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao criar recomendação: ", error);
            throw error;
        }

    }

    return {
        createRecomendation,
    }
}