import { useSQLiteContext } from "expo-sqlite";

export type UseActivity = {
    id: number,
    descricao: string,
    cor: string,
    ativo: boolean,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

type UseActivityRaw = Omit<UseActivity, "ativo" | "is_dirty"> & {
    ativo: number,
    is_dirty: number
}

function mapActivity(row: UseActivityRaw): UseActivity {
    return {
        ...row,
        ativo: row.ativo == 1,
        is_dirty: row.is_dirty === 1
    }
}

export function useActivityDatabase() {
    const database = useSQLiteContext();

    async function getActivityAll() {
        try {
            const rows = await database.getAllAsync<UseActivityRaw>(
                `SELECT * FROM atividades WHERE deleted_at IS NULL`
            )
            return rows.map(mapActivity);
        } catch (error) {
            console.error('Não foi possivel localizar as atividades', error)
        }
    }

    async function getActivity() {
        try {
            const rows = await database.getAllAsync<UseActivityRaw>(
                `SELECT * FROM atividades WHERE ativo = 1 AND deleted_at IS NULL`
            )
            return rows.map(mapActivity);
        } catch (error) {
            console.error('Não foi possivel localizar as atividades', error)
        }
    }

    async function getActivityByName(descricao: string) {
        try {
            const row = await database.getFirstAsync<UseActivityRaw>(
                `SELECT * FROM atividades WHERE descricao LIKE "%$descricao%" `,
                { $descricao: descricao }
            )

            return row ? mapActivity(row) : null;
        } catch (error) {
            console.error('Não foi possivel localiza a atividade', error)
        }
    }

    async function getActivityById(id: number) {
        try {
            const row = await database.getFirstAsync<UseActivityRaw>(
                'SELECT * FROM atividades WHERE id = $id',
                { $id: id }
            )

            return row ? mapActivity(row) : null;
        } catch {
            console.error("Não foi possivel localizar a atividade")
        }
    }

    async function createActivity(data: Pick<UseActivity, "descricao" | "cor">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO atividades (descricao, cor, created_at, updated_at, is_dirty, ativo)
            VALUES ($descricao, $cor, datetime('now'), datetime('now'), 1, 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $descricao: data.descricao,
                $cor: data.cor
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString();

            return ( console.log("Atividade cadastrada com Sucesso:", insertedRowId))
        } catch (error) {
            console.error('Erro ao inserir nova atividade', error)
        } finally {
            await sentece.finalizeAsync();
        }
    }

    async function updateActivity(data: Pick<UseActivity, "id" | "descricao" | "cor" | "ativo">) {

        const sentece = await database.prepareAsync(`
            UPDATE atividades SET descricao = $descricao, cor = $cor, ativo = $ativo, updated_at = datetime('now')
            WHERE id = $id
        `)

        try {
            await sentece.executeAsync({
                $id: data.id,
                $descricao: data.descricao,
                $cor: data.cor,
                $ativo: data.ativo ? 1 : 0,
            });
            console.log("Estamos no update")
        } catch (error) {
            console.error("erro ao alterar cadastro: ", data)
        } finally {
            await sentece.finalizeAsync();
        }

    }

    return { getActivity, getActivityAll, getActivityByName, getActivityById, createActivity, updateActivity }
}