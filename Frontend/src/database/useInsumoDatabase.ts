import { useSQLiteContext } from "expo-sqlite";

export type UseInsumo = {
    id: number,
    descricao: string,
    semente: boolean,
    ativo: boolean,
    unidades_medida_id: number,
    principios_ativos_id: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null,
}

export type UseInsumoListItem = {
    id: number,
    descricao: string,
    principio_ativo_descricao: string,
    unidade_sigla: string,
    saldo: number,
    ativo: boolean
}

export type UseInsumoRaw = Omit<UseInsumo, "ativo" | "semente" | "is_dirty"> & {
    ativo: number;
    semente: number;
    is_dirty: number;
}

function mapInsumo(row: UseInsumoRaw): UseInsumo {
    return {
        ...row,
        ativo: row.ativo === 1,
        semente: row.semente === 1,
        is_dirty: row.is_dirty === 1
    }
}

export function useInsumoDatabase() {
    const database = useSQLiteContext();

    async function createInsumo(data: Pick<UseInsumo, "descricao" | "semente" | "unidades_medida_id" | "principios_ativos_id">) {

        const sentence = await database.prepareAsync(`
            INSERT INTO insumos(descricao, semente, unidades_medida_id, principios_ativos_id, created_at, updated_at, is_dirty, ativo)
            VALUES ($descricao, $semente, $unidades_medida_id, $principios_ativos_id, datetime('now'), datetime('now'), 1, 1)
        `)

        try {

            const result = sentence.executeAsync({
                $descricao: data.descricao,
                $semente: data.semente,
                $unidades_medida_id: data.unidades_medida_id,
                $principios_ativos_id: data.principios_ativos_id
            })

            console.log("Sucesso ao cadastrar insumo", result);

            return { insertedRowI: (await result).lastInsertRowId }
        } catch (error) {
            console.error("Erro ao cadastrar insumo: ", error)
            return null
        } finally {
            sentence.finalizeAsync();
        }

    }

    async function getInsumoById(id: number) {
        try {
            const row = await database.getFirstAsync<UseInsumoRaw>(
                `SELECT 
                i.id AS id, i.descricao AS descricao,  i.ativo AS ativo, 
                i.semente AS semente, um.id AS unidades_medida_id, 
                um.descricao AS unidade_descricao,pa.id AS principios_ativos_id, 
                pa.descricao AS descricao_principi
                FROM insumos i
                INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
                INNER JOIN principios_ativos pa ON pa.id = i.principios_ativos_id
                WHERE i.id = $id `,
                { $id: id }
            )

            return row ? mapInsumo(row) : null
        } catch (error) {
            console.error("Erro ao localizar insumo: ", error)
            return null
        }
    }

    async function getInsumoAll() {
        try {
            const rows = await database.getAllAsync<{
                id: number,
                descricao: string,
                principio_ativo_descricao: string,
                unidade_sigla: string,
                ativo: boolean
            }>(`
                SELECT i.id, i.descricao, i.ativo, pa.descricao as principio_ativo_descricao, um.sigla as unidade_sigla
                FROM insumos i
                INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
                INNER JOIN principios_ativos pa ON pa.id = i.principios_ativos_id
                WHERE i.deleted_at IS NULL
            `)

            return rows.map(row => ({
                ...row,
                saldo: 0
            }))
        } catch (error) {
            console.error("Erro ao localizar insumos: ", error)
            return null
        }
    }

    async function getInsumoByDescricao(descricao: string, excludeId?: number) {
        try {
            let query = `SELECT * FROM insumos WHERE descricao = $descricao AND deleted_at IS NULL`;
            const params: any = { $descricao: descricao };

            if (excludeId) {
                query += ` AND id != $excludeId`;
                params.$excludeId = excludeId;
            }

            const row = await database.getFirstAsync<UseInsumoRaw>(query, params);
            return row ? mapInsumo(row) : null;
        } catch (error) {
            console.error("Erro ao localizar insumo por descrição: ", error);
            return null;
        }
    }

    async function updateInsumo(data: Pick<UseInsumo, "id" | "descricao" | "semente" | "unidades_medida_id" | "principios_ativos_id" | "ativo">) {

        const sentence = await database.prepareAsync(`
            UPDATE insumos SET 
            descricao = $descricao,
            semente = $semente, 
            unidades_medida_id = $unidades_medida_id,
            principios_ativos_id = $principios_ativos_id,
            ativo = $ativo,
            updated_at = datetime('now'),
            is_dirty = 1
            WHERE id = $id
        `)

        try {
            await sentence.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $semente: data.semente,
                $unidades_medida_id: data.unidades_medida_id,
                $principios_ativos_id: data.principios_ativos_id,
                $ativo: data.ativo
            })

            console.log(`update realizado com Sucesso!`)
        } catch (error) {
            console.error("Erro ao atualizar o cadastro", error)
            return null
        } finally {
            await sentence.finalizeAsync();
        }
    }

    return { createInsumo, getInsumoById, getInsumoAll, updateInsumo, getInsumoByDescricao }
}