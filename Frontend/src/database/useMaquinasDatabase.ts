import { useSQLiteContext } from "expo-sqlite";

export type useMaquinas = {
    id: number;
    descricao: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_dirty: boolean;
    server_id: number | null;
    deleted_at: string | null;
}

type useMaquinasRaw = Omit<useMaquinas, "is_dirty" | "ativo"> & {
    is_dirty: number;
    ativo: number;
}

function mapMaquinas(row: useMaquinasRaw): useMaquinas {
    return {
        ...row,
        is_dirty: row.is_dirty === 1,
        ativo: row.ativo === 1
    }
}

export function useMaquinasDatabase() {
    const database = useSQLiteContext();

    async function createMaquina(data: Pick<useMaquinas, "descricao">) {
        const sentence = await database.prepareAsync(`
           INSERT INTO maquinas(descricao, created_at, updated_at, is_dirty, ativo)
            VALUES ($descricao, datetime('now'), datetime('now'), 1, 1)     
        `)

        try {
            const result = await sentence.executeAsync({
                $descricao: data.descricao
            })

            console.log("Suceso maquina cadastrada: id ", result.lastInsertRowId)

            return { insertRowId: result.lastInsertRowId }
        } catch (error) {
            console.error('Erro ao cadastrar nova máquina', error)
            throw error
        } finally {
            await sentence.finalizeAsync();
        }
    }

    async function getMaquinasAll() {
        try {

            const rows = await database.getAllAsync<useMaquinasRaw>(`
                SELECT * 
                FROM maquinas 
                WHERE deleted_at IS NULL     
            `)

            console.log('Sucesso ao localizar maquinas', rows)
            return rows.map(mapMaquinas)
        } catch (error) {
            console.error('Erro ao localizar máquinas', error)
            throw error
        }
    }

    async function getMaquinas() {
        try {

            const rows = await database.getAllAsync<useMaquinasRaw>(`
                SELECT * 
                FROM maquinas 
                WHERE deleted_at IS NULL     
                  AND ativo = 1
            `)

            console.log('Sucesso ao localizar maquinas', rows)
            return rows.map(mapMaquinas)
        } catch (error) {
            console.error('Erro ao localizar máquinas', error)
            throw error
        }
    }


    async function getMaquinaById(id_maquina: number) {
        try {
            const row = await database.getFirstAsync<useMaquinasRaw>(`
                SELECT *
                FROM maquinas m
                WHERE m.id = $id_maquina
                  AND m.deleted_at IS NULL    
            `,
                { $id_maquina: id_maquina }
            )

            return row ? mapMaquinas(row) : null
        } catch (error) {
            console.error('Erro ao localizar maquina', error)
            throw error
        }
    }

    async function updateMaquinas(data: Pick<useMaquinas, "id" | "descricao" | "ativo">) {
        const sentence = await database.prepareAsync(`
            UPDATE maquinas 
            SET descricao = $descricao,
                ativo = $ativo,
                is_dirty = 1,
                updated_at = datetime('now')
            WHERE id = $id   
        `)

        try {
            await sentence.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $ativo: data.ativo ? 1 : 0
            });

            console.log("Sucesso ao editar maquina");
        } catch (error) {
            console.error("Erro ao editar maquina", error)
            throw error
        } finally {
            await sentence.finalizeAsync()
        }
    }

    return {
        createMaquina,
        getMaquinasAll,
        updateMaquinas,
        getMaquinaById,
        getMaquinas
    }

}