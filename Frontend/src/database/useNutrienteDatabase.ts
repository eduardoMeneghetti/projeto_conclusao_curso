import { useSQLiteContext } from "expo-sqlite";

export type NutrienteDatabase = {
    id: number;
    descricao: string;
    sigla: string;
    unidade: string;
};

export function useNutrienteDatabase() {
    const database = useSQLiteContext();

    async function getNutrientesAll(): Promise<NutrienteDatabase[]> {
        try {
            const rows = await database.getAllAsync<NutrienteDatabase>(`
                SELECT id, descricao, sigla, unidade
                FROM nutrientes
                WHERE deleted_at IS NULL
                ORDER BY descricao ASC
            `);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar nutrientes:', error);
            return [];
        }
    }

    async function getInsumosByNutriente(sigla: string) {
        
    }

    return { getNutrientesAll };
}