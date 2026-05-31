import { useSQLiteContext } from "expo-sqlite";
import { StatusRecomendacao } from '../util/statusRecomendacao';

export type RecommendationDatabase = {
    id: number;
    atividade_safra_id: number;
    atividade_gleba_id: number;
    analises_solo_id: number | null;
    data_inicio: string;
    data_fim: string;
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

export type RecomendacaoImportItem = {
    id: number;
    atividade_safra_id: number;
    atividade_gleba_id: number;
    operador_id: number;
    area_aplic: number;
    data_inicio: string;
    data_fim: string;
    status: StatusRecomendacao;
    gleba: string;
    safra: string;
    recomendante: string;
    total_itens: number;
};

export type RecomendacaoItemLista = {
    insumo: string;
    quantidade: number;
    dose: number;
    unidade: string;
}

export type RecomendationComplete = {
    id_recomendacao: number;
    data_inicio: string;
    data_fim: string;
    status: StatusRecomendacao;
    area_aplic: number;
    operador: string;
    recomendante: string;
    safra: string;
    gleba: string;
    origem: string;
    analises_solo_id: number | null;
    itens: RecomendacaoItemLista[];
}

type RecomendacaoItemFlat = Omit<RecomendationComplete, 'itens'> & RecomendacaoItemLista;

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

    async function createRecomendation(data: Pick<RecommendationDatabase, "atividade_safra_id" | "atividade_gleba_id" | "analises_solo_id" | "data_inicio" | "data_fim" | "operador_id" | "recomendante_id" | "area_aplic">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO recomendacoes_agricolas (atividade_safra_id, atividade_gleba_id, analises_solo_id, data_inicio, data_fim, operador_id, recomendante_id, area_aplic, status, created_at, updated_at, is_dirty, ativo)
            VALUES ($atividade_safra_id, $atividade_gleba_id, $analises_solo_id, $data_inicio, $data_fim, $operador_id, $recomendante_id, $area_aplic, 'P', datetime('now'), datetime('now'), 1, 1)`
        )

        try {
            const result = await sentece.executeAsync({
                $atividade_safra_id: data.atividade_safra_id,
                $atividade_gleba_id: data.atividade_gleba_id,
                $analises_solo_id: data.analises_solo_id ?? null,
                $data_inicio: data.data_inicio,
                $data_fim: data.data_fim,
                $operador_id: data.operador_id,
                $recomendante_id: data.recomendante_id,
                $area_aplic: data.area_aplic,
            })
            console.log("Recomendação criada com ID: ", result)

            return { insertedRowI: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao criar recomendação: ", error);
            throw error;
        } finally {
            await sentece.finalizeAsync();
        }

    }

    async function updateRecommendation(data: Pick<RecommendationDatabase, "id" | "atividade_safra_id" | "atividade_gleba_id" | "analises_solo_id" | "data_inicio" | "data_fim" | "operador_id" | "recomendante_id" | "area_aplic">) {

        const sentece = await database.prepareAsync(`
            UPDATE recomendacoes_agricolas
            SET atividade_safra_id = $atividade_safra_id,
                atividade_gleba_id = $atividade_gleba_id,
                analises_solo_id = $analises_solo_id,
                data_inicio = $data_inicio,
                data_fim = $data_fim,
                operador_id = $operador_id,
                recomendante_id = $recomendante_id,
                area_aplic = $area_aplic,
                updated_at = datetime('now'),
                is_dirty = 1
            WHERE id = $id`
        )

        try {
            const result = await sentece.executeAsync({
                $id: data.id,
                $atividade_safra_id: data.atividade_safra_id,
                $atividade_gleba_id: data.atividade_gleba_id,
                $analises_solo_id: data.analises_solo_id ?? null,
                $data_inicio: data.data_inicio,
                $data_fim: data.data_fim,
                $operador_id: data.operador_id,
                $recomendante_id: data.recomendante_id,
                $area_aplic: data.area_aplic,
            })
            console.log("Recomendação atualizada com ID: ", result)

            return { updatedRowId: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao atualizar recomendação: ", error);
            throw error;
        } finally {
            await sentece.finalizeAsync();
        }

    }

    async function getRecommendationAll(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<RecomendacaoItemFlat>(`
                SELECT
                    ra.id           AS id_recomendacao,
                    ra.data_inicio,
                    ra.data_fim,
                    ra.status,
                    ra.area_aplic,
                    u.nome          AS operador,
                    u2.nome         AS recomendante,
                    s.descricao     AS safra,
                    g.descricao     AS gleba,
                    ra.origem,
                    i.descricao     AS insumo,
                    rai.quantidade,
                    rai.dose,
                    ra.analises_solo_id, 
                    um.sigla        AS unidade
                FROM recomendacoes_agricolas ra
                INNER JOIN recomendacoes_agricolas_itens rai ON rai.recomendacao_agricola_id = ra.id
                INNER JOIN usuarios u  ON u.id  = ra.operador_id
                INNER JOIN usuarios u2 ON u2.id = ra.recomendante_id
                INNER JOIN insumos i   ON i.id  = rai.insumo_id
                INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
                INNER JOIN atividade_glebas ag ON ag.id = ra.atividade_gleba_id
                INNER JOIN glebas g    ON g.id  = ag.gleba_id
                INNER JOIN atividade_safras ats ON ats.id = ag.atividade_safra_id
                INNER JOIN safras s    ON s.id  = ats.safra_id
                WHERE ats.propriedade_id = $propriedade_id
                AND ra.deleted_at IS NULL
                ORDER BY ra.data_inicio DESC, ra.id DESC
            `, { $propriedade_id: propriedade_id });

            const map = new Map<number, RecomendationComplete>();

            for (const row of rows) {
                if (!map.has(row.id_recomendacao)) {
                    map.set(row.id_recomendacao, {
                        id_recomendacao: row.id_recomendacao,
                        data_inicio: row.data_inicio,
                        data_fim: row.data_fim,
                        status: row.status,
                        area_aplic: row.area_aplic,
                        operador: row.operador,
                        recomendante: row.recomendante,
                        safra: row.safra,
                        gleba: row.gleba,
                        origem: row.origem,
                        analises_solo_id: row.analises_solo_id,
                        itens: [],
                    });
                }
                map.get(row.id_recomendacao)!.itens.push({
                    insumo: row.insumo,
                    quantidade: row.quantidade,
                    dose: row.dose,
                    unidade: row.unidade,
                });
            }

            return Array.from(map.values());
        } catch (error) {
            console.error("Erro ao buscar recomendações: ", error);
            return [];
        }
    }

    async function getRecommendationById(recomendacao_id: number) {
        try {
            const row = await database.getFirstAsync<RecommendationDatabaseRaw>(`
                SELECT * FROM recomendacoes_agricolas
                WHERE id = $recomendacao_id
                AND deleted_at IS NULL
            `, { $recomendacao_id: recomendacao_id });

            return row ? mapRecommendation(row) : null;
        } catch (error) {
            console.error('Erro ao buscar recomendacao: ', error)
            throw error
        }
    }

    async function updateStatusRecomendation() {
        try {
            await database.withTransactionAsync(async () => {

                await database.runAsync(`
                UPDATE recomendacoes_agricolas
                SET status = 'A',
                    updated_at = datetime('now'),
                    is_dirty = 1
                WHERE status = 'P'
                  AND date('now') > date(data_fim)
                  AND deleted_at IS NULL
                `);

                await database.runAsync(`
                UPDATE recomendacoes_agricolas
                SET status = 'F',
                    updated_at = datetime('now'),
                    is_dirty = 1
                WHERE deleted_at IS NULL
                    AND status IN ('P', 'A')
                    AND (
                    SELECT COALESCE(SUM(ap.area_aplic), 0)
                    FROM aplicacoes_insumos ap
                    WHERE ap.recomendacoes_agricolas_id = recomendacoes_agricolas.id
                    AND ap.deleted_at IS NULL
                    ) >= area_aplic
                `);

            });
        } catch (error) {
            console.error('Erro ao atualizar status das recomendações:', error);
        }
    }

    async function deleteRecommendation(recomendacao_id: number) {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync(
                    `UPDATE recomendacoes_agricolas_itens
                     SET deleted_at = datetime('now'), is_dirty = 1
                     WHERE recomendacao_agricola_id = $id`,
                    { $id: recomendacao_id }
                );
                await database.runAsync(
                    `UPDATE recomendacoes_agricolas
                     SET deleted_at = datetime('now'), ativo = 0, is_dirty = 1
                     WHERE id = $id`,
                    { $id: recomendacao_id }
                );
            });
        } catch (error) {
            console.error('Erro ao deletar recomendação:', error);
            throw error;
        }
    }

    async function getRecomendacoesListaImportacao(propriedade_id: number): Promise<RecomendacaoImportItem[]> {
        try {
            return await database.getAllAsync<RecomendacaoImportItem>(`
                SELECT
                    ra.id,
                    ra.atividade_safra_id,
                    ra.atividade_gleba_id,
                    ra.operador_id,
                    ra.area_aplic,
                    ra.data_inicio,
                    ra.data_fim,
                    ra.status,
                    g.descricao  AS gleba,
                    s.descricao  AS safra,
                    u2.nome      AS recomendante,
                    (SELECT COUNT(*) FROM recomendacoes_agricolas_itens rai
                     WHERE rai.recomendacao_agricola_id = ra.id
                       AND rai.deleted_at IS NULL) AS total_itens
                FROM recomendacoes_agricolas ra
                INNER JOIN atividade_glebas ag  ON ag.id  = ra.atividade_gleba_id
                INNER JOIN glebas g             ON g.id   = ag.gleba_id
                INNER JOIN atividade_safras ats ON ats.id = ra.atividade_safra_id
                INNER JOIN safras s             ON s.id   = ats.safra_id
                INNER JOIN usuarios u2          ON u2.id  = ra.recomendante_id
                WHERE ats.propriedade_id = $propriedade_id
                  AND ra.deleted_at IS NULL
                  AND ra.status IN ('P', 'A', 'R')
                ORDER BY ra.data_inicio DESC
            `, { $propriedade_id: propriedade_id });
        } catch (error) {
            console.error('Erro ao buscar recomendações para importação:', error);
            return [];
        }
    }

    return {
        createRecomendation,
        updateRecommendation,
        getRecommendationAll,
        getRecommendationById,
        getRecomendacoesListaImportacao,
        updateStatusRecomendation,
        deleteRecommendation
    }
}
