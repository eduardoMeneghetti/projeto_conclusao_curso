import { useSQLiteContext } from "expo-sqlite";

export type UseAnaliseClassificacao = {
    classificacao: string
}

export default function useFichamentoDatabase(){
    const database = useSQLiteContext();

     async function classificarParametro(parametro_id: number, valor: number) {
        const fichamento = await database.getFirstAsync<UseAnaliseClassificacao>(`
        SELECT classificacao 
        FROM fichamentos 
        WHERE parametros_metrica_id = $parametro_id
        AND valor_min <= $valor 
        AND valor_max >= $valor
        AND deleted_at IS NULL
    `, { $parametro_id: parametro_id, $valor: valor });

        return fichamento?.classificacao ?? null;
    }

    return {
        classificarParametro
    }
}