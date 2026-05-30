import { useSQLiteContext } from "expo-sqlite";

export type useAplic = {
    id: number;
    atividade_safra_id: number;
    atividade_gleba_id: number;
    maquina_id: number;
    operador_id: number;
    recomendacoes_agricolas_id: number | null;
    area_aplic: number | null;
    data_inicio: string;
    data_final: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_dirty: boolean;
    server_id: number | null;
    deleted_at: string | null;
}

type useAplicRaw = Omit<useAplic, "is_dirty" | "ativo"> & {
    is_dirty: number;
    ativo: number;
}

function mapAplic(row: useAplicRaw): useAplic {
    return {
        ...row,
        is_dirty: row.is_dirty === 1,
        ativo: row.ativo === 1
    }
}

export function UseAplicacoesDatabase() {
    const database = useSQLiteContext();

    async function createAplic(data: Pick<useAplic, "atividade_safra_id" | "atividade_gleba_id" | "maquina_id" | "operador_id" | "recomendacoes_agricolas_id" | "area_aplic" | "data_inicio" | "data_final">) {
        const sentece = await database.prepareAsync(`
            INSERT INTO aplicacoes_insumos (atividade_safra_id, atividade_gleba_id, maquina_id, operador_id, recomendacoes_agricolas_id, area_aplic, data_inicio, data_final, created_at, updated_at, ativo, is_dirty)
                                   VALUES ($atividade_safra_id, $atividade_gleba_id, $maquina_id, $operador_id, $recomendacoes_agricolas_id, $area_aplic, $data_inicio, $data_final, datetime('now'), datetime('now'), 1, 1) 
        `)

        try {
            const result = await sentece.executeAsync({
                $atividade_safra_id: data.atividade_safra_id,
                $atividade_gleba_id: data.atividade_gleba_id,
                $maquina_id: data.maquina_id,
                $operador_id: data.operador_id,
                $recomendacoes_agricolas_id: data.recomendacoes_agricolas_id ?? null,
                $area_aplic: data.area_aplic,
                $data_inicio: data.data_inicio,
                $data_final: data.data_final
            })

            console.log("Aplicação gerada com sucesso! :", result)

            return { insertRowId: result.lastInsertRowId }
        } catch (error) {
            console.error("Erro ao realizar cadastro de aplicação: ", error)
            throw error
        } finally {
            await sentece.finalizeAsync();
        }
    }

    return {
        createAplic
    }
}