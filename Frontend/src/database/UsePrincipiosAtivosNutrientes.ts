import { useSQLiteContext } from "expo-sqlite";

export type UsePrincipiosNutrientes = {
    id: number,
    principios_ativo_id: number,
    nutriente_id: number,
    percentual: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

export type NutrienteItem = {
    nutriente_id: number;
    descricao: string;
    sigla: string;
    percentual: number;
};

type UsePrincipiosNutrientesRaw = Omit<UsePrincipiosNutrientes, "is_dirty"> & {
    is_dirty: number
}

function mapPrincipioNutriente(row: UsePrincipiosNutrientesRaw): UsePrincipiosNutrientes {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    }
}

export function UsePrincipiosAtivosNutrientes() {
    const database = useSQLiteContext();

    async function createPrincipioNutriente(data: Pick<UsePrincipiosNutrientes, "principios_ativo_id" | "nutriente_id" | "percentual">) {
        const sentece = await database.prepareAsync(`
            INSERT INTO principios_ativos_nutrientes (principios_ativo_id, nutriente_id, percentual, created_at, updated_at, is_dirty)
            VALUES ($principios_ativo_id, $nutriente_id, $percentual, datetime('now'), datetime('now'), 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $principios_ativo_id: data.principios_ativo_id,
                $nutriente_id: data.nutriente_id,
                $percentual: data.percentual
            })
            return { insertedRowId: result.lastInsertRowId }
        } catch (error) {
            console.error("Erro ao associar nutriente ao principio ativo: ", error)
            throw error
        } finally {
            await sentece.finalizeAsync()
        }
    }

    async function updatePrincipiosNutrientes(data: Pick<UsePrincipiosNutrientes, "id" | "principios_ativo_id" | "nutriente_id" | "percentual">) {
        const sentece = await database.prepareAsync(`
            UPDATE principios_ativos_nutrientes
            SET principios_ativo_id = $principios_ativo_id,
                nutriente_id = $nutriente_id,
                percentual = $percentual,
                is_dirty = 1,
                updated_at = datetime('now')
            WHERE id = $id
        `)

        try {
            const result = await sentece.executeAsync({
                $id: data.id,
                $principios_ativo_id: data.principios_ativo_id,
                $nutriente_id: data.nutriente_id,
                $percentual: data.percentual
            })
            console.log("Sucesso ao realizar alteração", result)
        } catch (error) {
            console.error('Erro ao realizar o update', error)
            throw error
        } finally {
            await sentece.finalizeAsync()
        }
    }

    async function getPrincipiosNutrientesAll() {
        try {
            const rows = await database.getAllAsync<UsePrincipiosNutrientesRaw>(`
                SELECT *
                FROM principios_ativos_nutrientes
                WHERE deleted_at IS NULL
            `)
            return rows.map(mapPrincipioNutriente);
        } catch (error) {
            console.error('Erro ao localizar principiosNutrientes', error)
            throw error
        }
    }

    async function getNutrientesByPrincipioId(principios_ativo_id: number): Promise<NutrienteItem[]> {
        try {
            const rows = await database.getAllAsync<NutrienteItem>(`
                SELECT
                    pan.nutriente_id,
                    n.descricao,
                    n.sigla,
                    pan.percentual
                FROM principios_ativos_nutrientes pan
                INNER JOIN nutrientes n ON n.id = pan.nutriente_id
                WHERE pan.principios_ativo_id = $principios_ativo_id
                AND pan.deleted_at IS NULL
            `, { $principios_ativo_id: principios_ativo_id });
            return rows;
        } catch (error) {
            console.error('Erro ao localizar nutrientes do principio', error);
            return [];
        }
    }

    async function deleteNutrientesByPrincipioId(principios_ativo_id: number) {
        try {
            await database.runAsync(
                `DELETE FROM principios_ativos_nutrientes WHERE principios_ativo_id = $principios_ativo_id`,
                { $principios_ativo_id: principios_ativo_id }
            );
        } catch (error) {
            console.error('Erro ao deletar nutrientes do principio', error);
            throw error;
        }
    }

    return {
        createPrincipioNutriente,
        updatePrincipiosNutrientes,
        getPrincipiosNutrientesAll,
        getNutrientesByPrincipioId,
        deleteNutrientesByPrincipioId,
    }
}