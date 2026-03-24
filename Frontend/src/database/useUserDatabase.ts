import { useSQLiteContext } from "expo-sqlite";
import { setEnabled } from "react-native/Libraries/Performance/Systrace";

export type UserDatabase = {
    id: number;
    nome: string;
    usuario: string;
    senha: string;
    email: string;
    operador: boolean;
    recomendante: boolean;
    ativo: boolean;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_dirty: boolean;
    server_id: number | null;
}

type UserDatabaseRaw = Omit<UserDatabase, "operador" | "recomendante" | "ativo" | "is_dirty"> & {
    operador: number;
    recomendante: number;
    ativo: number;
    is_dirty: number;
};

function mapUser(row: UserDatabaseRaw): UserDatabase {
    return {
        ...row,
        operador: row.operador === 1,
        recomendante: row.recomendante === 1,
        ativo: row.ativo === 1,
        is_dirty: row.is_dirty === 1,
    };
}

export function useUserDatabase() {
    const database = useSQLiteContext()

    async function create(data: Omit<UserDatabase, "id" | "ativo" | "created_at" | "updated_at" | "synced_at" | "is_dirty" | "server_id">) {

        const statement = await database.prepareAsync(`
            INSERT INTO usuarios (nome, usuario, senha, email, operador, recomendante, ativo, created_at, updated_at, is_dirty) 
            VALUES ($nome, $usuario, $senha, $email, $operador, $recomendante, 1 , datetime('now'), datetime('now'), 1)
        `);

        try {
            const result = await statement.executeAsync({
                $nome: data.nome,
                $usuario: data.usuario,
                $senha: data.senha,
                $email: data.email,
                $operador: data.operador ? 1 : 0,
                $recomendante: data.recomendante ? 1 : 0,
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            return { insertedRowId }
        } catch (error) {
            console.log('Erro ao criar usuário: ', error)
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getUsersAll() {
        try {
            const rows = await database.getAllAsync<UserDatabaseRaw>(`
             SELECT * FROM usuarios WHERE deleted_at IS NULL
            `);
            return rows.map(mapUser);
        } catch (error) {
            console.error('erro ao buscar usuários ', error)
        }
    }

    async function getUsersById(id: number) {
        try {
            const row = await database.getFirstAsync<UserDatabaseRaw>(
                `SELECT * FROM usuarios WHERE id = $id `,
                { $id: id }
            );
            return row ? mapUser(row) : null;
        } catch (error) {
            console.error('erro ao buscar usuários ', error)
        }
    }


    async function getUsersActive() {
        try {
            const rows = await database.getAllAsync<UserDatabaseRaw>(`
             SELECT * FROM usuarios WHERE deleted_at IS NULL AND ativo = 1
            `);
            return rows.map(mapUser);
        } catch (error) {
            console.error('erro ao buscar usuários ', error)
        }
    }

    async function getByCrendentials(usuario: string, senha: string): Promise<UserDatabase | null> {
        try {
            const row = await database.getFirstAsync<UserDatabaseRaw>(
                "SELECT * FROM usuarios WHERE usuario = $usuario AND senha = $senha AND ativo = 1",
                { $usuario: usuario, $senha: senha }
            );
            return row ? mapUser(row) : null;
        } catch (error) {
            throw error;
        }
    }

    async function getUsuariosDirty() {
        try {
            const rows = await database.getAllAsync<UserDatabaseRaw>(
                `SELECT * FROM usuarios WHERE is_dirty = 1`
            );
            return rows.map(mapUser);
        } catch (error) {
            console.error("Erro ao buscar usuários dirty:", error);
            return [];
        }
    }

    async function updateSyncedUsuario(data: { id: number, server_id: number, synced_at: string }) {
        const sentence = await database.prepareAsync(`
        UPDATE usuarios 
        SET server_id = $server_id,
            synced_at = $synced_at,
            is_dirty = 0
        WHERE id = $id
    `);

        try {
            await sentence.executeAsync({
                $id: data.id,
                $server_id: data.server_id,
                $synced_at: data.synced_at
            });
        } catch (error) {
            console.error("Erro ao atualizar usuário sincronizado:", error);
        } finally {
            await sentence.finalizeAsync();
        }
    }

    async function updateUsuarios(data: Pick<UserDatabase, "id" | "nome" | "usuario" | "senha" | "email" | "operador" | "recomendante" | "ativo">) {
        const sentece = await database.prepareAsync(`
            UPDATE usuarios 
            SET nome = $nome, usuario = $usuario, senha = $senha, email = $email, operador = $operador, recomendante = $recomendante, ativo = $ativo, updated_at = datetime('now')
            WHERE id = $id
         `)

        try {
            await sentece.executeAsync({
                $id: data.id,
                $nome: data.nome,
                $usuario: data.usuario,
                $senha: data.senha,
                $email: data.email,
                $operador: data.operador ? 1 : 0,
                $recomendante: data.recomendante ? 1 : 0,
                $ativo: data.ativo ? 1 : 0
            })
            console.log('Update realizado com Sucesso!')
        } catch (error) {
            console.error("Erro ao atualizar registro: ", error)
        } finally {
            await sentece.finalizeAsync();
        }
    }

    async function checkUsuarioExists(usuario: string): Promise<boolean> {
        try {
            const row = await database.getFirstAsync(
                `SELECT id FROM usuarios WHERE usuario = $usuario`,
                { $usuario: usuario }
            );
            return !!row;
        } catch (error) {
            return false;
        }
    }

    async function checkEmailExists(email: string): Promise<boolean> {
        try {
            const row = await database.getFirstAsync(
                `SELECT id FROM usuarios WHERE email = $email`,
                { $email: email }
            );
            return !!row;
        } catch (error) {
            return false;
        }
    }

    return { create, getByCrendentials, getUsersAll, getUsersActive, getUsuariosDirty, updateSyncedUsuario, updateUsuarios, getUsersById, checkUsuarioExists, checkEmailExists }
}