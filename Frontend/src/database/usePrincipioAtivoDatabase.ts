import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export type PrincipioAtivoDatabase = {
    id: number,
    descricao: string, 
    ativo: boolean,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

type PrincipioAtivoDatabaseRaw = Omit<PrincipioAtivoDatabase, "ativo" | "is_dirty"> & {
    ativo: number,
    is_dirty: number
}

function mapPrincipioAtivo(row: PrincipioAtivoDatabaseRaw): PrincipioAtivoDatabase {
    return {
        ...row,
        ativo: row.ativo === 1,
        is_dirty: row.is_dirty === 1
    };
}

export function usePrincipioAtivoDatabase() {
    const database = useSQLiteContext();

    async function createPrincipioAtivo(data: Pick<PrincipioAtivoDatabase, "descricao">) {
        
        const sentece = await database.prepareAsync(`
            INSERT INTO principios_ativos (descricao, created_at, updated_at, is_dirty, ativo)    
            VALUES ($descricao, datetime('now'), datetime('now'), 1, 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $descricao: data.descricao
            })

            const insertRowId = result.lastInsertRowId.toLocaleString();

            return { insertRowId }
        } catch (error) {
            console.log("nao foi possivel cadastrar o principio ativo: ", error)
            throw error;
        }finally {
            await sentece.finalizeAsync();
        }

    }

    async function getPrincipioAtivo() {
        try {
            const rows = await database.getAllAsync<PrincipioAtivoDatabaseRaw>(`
                SELECT * FROM principios_ativos WHERE ativo == 1 AND deleted_at IS NULL
            `)
            return rows.map(mapPrincipioAtivo)
        } catch (error) {
            console.error("Erro ao buscar principio ativo:", error)
        }  
    }

    async function getPrincipioAtivoAll() {
        try {
            const rows = await database.getAllAsync<PrincipioAtivoDatabaseRaw>(`
                SELECT * FROM principios_ativos WHERE ativo = 1
            `)
            return rows.map(mapPrincipioAtivo)
        }
        catch (error) {
            console.error("Erro ao buscar principio ativo:", error)
        }
    }

    async function getPrincipioAtivoById(id: number) {
        try {
            const row = await database.getFirstAsync<PrincipioAtivoDatabaseRaw>(
                `SELECT * FROM principios_ativos WHERE id = $id`,
                { $id: id }
            );
            return row ? mapPrincipioAtivo(row) : null;
        }catch (error) {
            console.log("erro ao buscar principio ativo", error);
            return null;
        }
    }

    async function updatePrincipioAtivo(data: Pick<PrincipioAtivoDatabase, "id" | "descricao" | "ativo">) {
        
        const sentece = await database.prepareAsync(`
            UPDATE principios_ativos 
            SET descricao = $descricao, ativo = $ativo, updated_at = datetime('now'), is_dirty = 1
            WHERE id = $id
        `)

        try {
            
            await sentece.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $ativo: data.ativo ? 1 : 0
            })

        } catch (error) {
            console.log("erro ao atualizar principio ativo", error);    
            throw error;
        }finally {
            await sentece.finalizeAsync();
        }

    }


    return { createPrincipioAtivo, getPrincipioAtivo, getPrincipioAtivoAll, getPrincipioAtivoById, updatePrincipioAtivo }
}