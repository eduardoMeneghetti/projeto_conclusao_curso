import { useSQLiteContext } from "expo-sqlite";

export type useAnalisesResultados = {
    id: number,
    analises_solo_id: number,
    parametro_medido: string,
    parametro_medido_id: number,
    valor: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

type useAnalisesResultadosRaw = Omit<useAnalisesResultados, "is_dirty"> & {
    is_dirty: number
}

function mapAnalisesSoloResultado(row: useAnalisesResultadosRaw): useAnalisesResultados {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    }
}

export function useAnalisesSoloResultados() {
    const database = useSQLiteContext();

    async function createAnalisesSoloResultados(data: Pick<useAnalisesResultadosRaw, "analises_solo_id" | "parametro_medido" | "parametro_medido_id" | "valor">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO analises_solo_resultados (analises_solo_id, parametro_medido, parametro_medido_id, valor, created_at, updated_at, is_dirty)
            VALUES ($analises_solo_id, $parametro_medido, $parametro_medido_id, $valor, datetime('now'), datetime('now'), 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $analises_solo_id: data.analises_solo_id,
                $parametro_medido: data.parametro_medido,
                $parametro_medido_id: data.parametro_medido_id,
                $valor: data.valor
            })
            const insertedRowId = result.lastInsertRowId.toLocaleString();
            return (console.log("Analise laboratorial salva com sucesso:", insertedRowId))
        } catch (error) {
            console.error("Erro ao salvar analise laboratorial: ", error)
            throw error
        } finally {
            await sentece.finalizeAsync();
        }
    }

    return {
        createAnalisesSoloResultados
    }

}