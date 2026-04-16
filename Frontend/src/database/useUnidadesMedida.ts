import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export type UseUnidadesMedida = {
    id: number,
    descricao: string,
    sigla: string,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null,
    ativo: boolean
}

type UseUnidadesMedidaRaw = Omit<UseUnidadesMedida, "is_dirty" | "ativo"> & {
    is_dirty: number,
    ativo: number
}

function mapUnidadesMedida(row: UseUnidadesMedidaRaw): UseUnidadesMedida {
    return {
        ...row,
        is_dirty: row.is_dirty === 1,
        ativo: row.ativo === 1
    };
}


export function useUnidadesMedida() {
    const database = useSQLiteContext();

    async function createUnidadeMedida(data: Pick<UseUnidadesMedida, "descricao" | "sigla">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO unidades_medidas (descricao, sigla, created_at, updated_at, is_dirty, ativo)    
            VALUES ($descricao, $sigla, datetime('now'), datetime('now'), 1, 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $descricao: data.descricao,
                $sigla: data.sigla
            })

            const insertRowId = result.lastInsertRowId.toLocaleString();

            return { insertRowId }
        } catch (error) {
            console.log("nao foi possivel cadastrar a unidade de medida: ", error)
            throw error;
        }finally {
            await sentece.finalizeAsync();
        }

    }

    async function getUnidadesMedida() {
        try {
            const rows = await database.getAllAsync<UseUnidadesMedidaRaw>(`
                SELECT * FROM unidades_medidas WHERE ativo = 1 AND deleted_at IS NULL
            `);
            return rows.map(mapUnidadesMedida);
        } catch (error) {
            console.log("nao foi possivel obter as unidades de medida: ", error)
            throw error;
        }
    } 

    async function getUnidadesMedidaAll() {
        try {
            const rows = await database.getAllAsync<UseUnidadesMedidaRaw>(`
                SELECT * FROM unidades_medidas WHERE ativo = 1
            `);
            return rows.map(mapUnidadesMedida); 
        }catch (error) {
            console.log("nao foi possivel obter as unidades de medida: ", error)
            throw error;
        }
    }

    async function getUnidadesMedidaById(id: number) {
        try {
            const row = await database.getFirstAsync<UseUnidadesMedidaRaw>(`
                SELECT * FROM unidades_medidas WHERE id = $id 
            `, { $id: id });
            return row ? mapUnidadesMedida(row) : null; 
        }catch (error) {
            console.log("nao foi possivel obter a unidade de medida por id: ", error)
            throw error;
        }
    }

    async function updateUnidadeMedida(data: Pick<UseUnidadesMedida, "id" | "descricao" | "sigla" | "ativo">) {

        const sentence = await database.prepareAsync(`
            UPDATE unidades_medidas 
            SET descricao = $descricao, sigla = $sigla, ativo = $ativo, updated_at = datetime('now'), is_dirty = 1
            WHERE id = $id
        `)

        try {
            
            await sentence.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $sigla: data.sigla,
                $ativo: data.ativo ? 1 : 0
            })

        } catch (error) {
            console.log("nao foi possivel atualizar a unidade de medida: ", error)
            throw error;
        }finally {
            await sentence.finalizeAsync();
        }

    }

    return {createUnidadeMedida, getUnidadesMedida, getUnidadesMedidaById, getUnidadesMedidaAll, updateUnidadeMedida }

}