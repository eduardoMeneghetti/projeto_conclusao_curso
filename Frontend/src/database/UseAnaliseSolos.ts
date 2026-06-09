import { useSQLiteContext } from "expo-sqlite";

export type AnaliseHistorico = {
    analise_id: number;
    data_coleta: string;
    safra: string;
    gleba: string;
    argila: number | null;
    mo: number | null;
    ctc: number | null;
    fosforo: number | null;
    potassio: number | null;
    gerou_recomendacao: number;
}

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

    async function getHistoricoAnaliseSolo(
        propriedade_id: number,
        safra_id: number | null,
        data_inicio: string | null,
        data_fim: string | null
    ): Promise<AnaliseHistorico[]> {
        const filtroDataInicio = data_inicio
            ? `AND date(ans.data_coleta) >= date('${data_inicio}')`
            : '';
        const filtroDataFim = data_fim
            ? `AND date(ans.data_coleta) <= date('${data_fim}')`
            : '';
        const filtroSafra = safra_id
            ? `AND ats.safra_id = ${safra_id}`
            : ''

        try {
            return await database.getAllAsync<AnaliseHistorico>(`
            SELECT
                ans.id AS analise_id,
                ans.data_coleta,
                s.descricao AS safra,
                g.descricao AS gleba,
                MAX(CASE WHEN pm.tipo = 'ARGILA' THEN asr.valor END) AS argila,
                MAX(CASE WHEN pm.tipo = 'MO'     THEN asr.valor END) AS mo,
                MAX(CASE WHEN pm.tipo = 'CTC'    THEN asr.valor END) AS ctc,
                MAX(CASE WHEN pm.tipo = 'P'      THEN asr.valor END) AS fosforo,
                MAX(CASE WHEN pm.tipo = 'K'      THEN asr.valor END) AS potassio,
                CASE 
                    WHEN ra.id IS NOT NULL THEN 1 
                ELSE 0 
                END AS gerou_recomendacao
            FROM analises_solos ans
            INNER JOIN analises_solo_resultados asr ON asr.analises_solo_id = ans.id
            INNER JOIN parametros_metricas pm ON pm.id = asr.parametro_medido_id
            INNER JOIN atividade_safras ats ON ats.id = ans.atividade_safra_id
            INNER JOIN safras s ON s.id = ats.safra_id
            INNER JOIN atividade_glebas ag ON ag.id = ans.atividade_gleba_id
            INNER JOIN glebas g ON g.id = ag.gleba_id
            LEFT JOIN recomendacoes_agricolas ra ON ra.analises_solo_id = ans.id
                AND ra.deleted_at IS NULL
            WHERE ats.propriedade_id = ${propriedade_id}
                AND ans.deleted_at IS NULL
                ${filtroDataInicio}
                ${filtroDataFim}
                ${filtroSafra}
            GROUP BY ans.id
            ORDER BY ans.data_coleta DESC   
            `);
        } catch (error) {
            console.error('Erro ao buscar histórico de analises: ', error)
            return []
        }

    }

    return {
        createAnaliseSolo,
        getHistoricoAnaliseSolo
    }
}