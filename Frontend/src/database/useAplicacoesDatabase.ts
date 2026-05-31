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

export type AplicacaoItemLista = {
    insumo: string;
    quantidade: number;
    dose: number;
    unidade: string;
}

export type AplicacaoComplete = {
    id_aplicacao: number;
    data_inicio: string;
    data_final: string;
    area_aplic: number;
    operador: string;
    safra: string;
    gleba: string;
    recomendacoes_agricolas_id: number | null;
    itens: AplicacaoItemLista[];
}

type AplicacaoItemFlat = Omit<AplicacaoComplete, 'itens'> & AplicacaoItemLista;

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

    async function getAplicacoesAll(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<AplicacaoItemFlat>(`
            SELECT 
                ai.id AS id_aplicacao,
                ai.data_inicio,
                ai.data_final,
                ai.area_aplic,
                ai.recomendacoes_agricolas_id,
                u.nome AS operador,
                m.descricao AS maquina, 
                s.descricao AS safra,
                g.descricao AS gleba,
                i.descricao AS insumo,
                aii.quantidade_aplic AS quantidade,
                aii.dose_aplic       AS dose,
                um.sigla AS unidade
            FROM aplicacoes_insumos ai
            INNER JOIN aplicacoes_itens_insumos aii ON aii.aplicacoes_insumo_id = ai.id
            LEFT JOIN recomendacoes_agricolas ra ON ra.id = ai.recomendacoes_agricolas_id
            INNER JOIN usuarios u ON u.id = ai.operador_id
            INNER JOIN maquinas m ON m.id = ai.maquina_id
            INNER JOIN atividade_glebas ag ON ag.id  = ai.atividade_gleba_id
            INNER JOIN glebas g ON ag.gleba_id = g.id
            INNER JOIN atividade_safras as2 ON as2.id = ai.atividade_safra_id
            INNER JOIN safras s ON s.id = as2.safra_id
            INNER JOIN insumos i ON i.id = aii.insumo_id 
            INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
            WHERE as2.propriedade_id = $propriedade_id
              AND ai.deleted_at IS NULL
              AND aii.deleted_at IS NULL
              ORDER BY ai.data_inicio DESC, ai.id DESC 
            `, { $propriedade_id: propriedade_id })

            const aplicacoesMap = new Map<number, AplicacaoComplete>();

            for (const row of rows) {
                if (!aplicacoesMap.has(row.id_aplicacao)) {
                    aplicacoesMap.set(row.id_aplicacao, {
                        id_aplicacao: row.id_aplicacao,
                        data_inicio: row.data_inicio,
                        data_final: row.data_final,
                        area_aplic: row.area_aplic,
                        operador: row.operador,
                        safra: row.safra,
                        gleba: row.gleba,
                        recomendacoes_agricolas_id: row.recomendacoes_agricolas_id,
                        itens: [],
                    });
                }
                aplicacoesMap.get(row.id_aplicacao)!.itens.push({
                    insumo: row.insumo,
                    quantidade: row.quantidade,
                    dose: row.dose,
                    unidade: row.unidade
                })

            }

            return Array.from(aplicacoesMap.values());
        } catch (error) {
            console.error("Erro ao buscar aplicações: ", error)
            throw error
        }
    }

    async function getAplicacaoById(id: number) {
        try {
            const row = await database.getFirstAsync<useAplicRaw>(`
                SELECT * FROM aplicacoes_insumos
                WHERE id = $id
                  AND deleted_at IS NULL
            `, { $id: id }
            )

            return row ? mapAplic(row) : null;
        } catch (error) {
            console.error("Erro ao buscar aplicação por ID: ", error)
            throw error
        }

    }

    async function updateAplicacao(data: Pick<useAplic, "id" | "atividade_safra_id" | "atividade_gleba_id" | "maquina_id" | "operador_id" | "recomendacoes_agricolas_id" | "area_aplic" | "data_inicio" | "data_final">) {
        const sentece = await database.prepareAsync(`
            UPDATE aplicacoes_insumos
            SET atividade_safra_id = $atividade_safra_id,
                atividade_gleba_id = $atividade_gleba_id,
                maquina_id = $maquina_id,
                operador_id = $operador_id,
                recomendacoes_agricolas_id = $recomendacoes_agricolas_id,
                area_aplic = $area_aplic,
                data_inicio = $data_inicio,
                data_final = $data_final,
                updated_at = datetime('now'),
                is_dirty = 1
            WHERE id = $id
        `)

        try {
            const result = await sentece.executeAsync({
                $id: data.id,
                $atividade_safra_id: data.atividade_safra_id,
                $atividade_gleba_id: data.atividade_gleba_id,
                $maquina_id: data.maquina_id,
                $operador_id: data.operador_id,
                $recomendacoes_agricolas_id: data.recomendacoes_agricolas_id ?? null,
                $area_aplic: data.area_aplic,
                $data_inicio: data.data_inicio,
                $data_final: data.data_final
            })

            console.log("Aplicação atualizada com sucesso! :", result)

            return { rowsAffected: result.changes }
        } catch (error) {
            console.error("Erro ao atualizar aplicação: ", error)
            throw error
        } finally {
            await sentece.finalizeAsync();
        }
    }

    async function deleteAplicacao(aplicacoes_insumo_id: number) {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync(`
                    UPDATE aplicacoes_itens_insumos
                    SET deleted_at = datetime('now'), is_dirty = 1
                    WHERE aplicacoes_insumo_id = $aplicacoes_insumo_id`, 
                    { $aplicacoes_insumo_id: aplicacoes_insumo_id }
                );

                await database.runAsync(`
                    UPDATE aplicacoes_insumos
                    SET deleted_at = datetime('now'), is_dirty = 1, ativo = 0 
                    WHERE id = $aplicacoes_insumo_id`, 
                    { $aplicacoes_insumo_id: aplicacoes_insumo_id }
                );

                await database.runAsync(`
                    UPDATE movimentacao_estoque_insumos
                    SET deleted_at = datetime('now'), is_dirty = 1
                    WHERE aplicacoes_insumo_id = $aplicacoes_insumo_id`,
                    { $aplicacoes_insumo_id: aplicacoes_insumo_id }
                );
            })
        } catch (error) {
            console.error("Erro ao excluir aplicação: ", error)
            throw error
        }

    }

    return {
        createAplic,
        getAplicacoesAll,
        getAplicacaoById,
        updateAplicacao,
        deleteAplicacao
    }
}