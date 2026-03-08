import { useSQLiteContext } from "expo-sqlite";

export type UserDatabase = {
    id: number;
    nome: string;
    usuario: string;
    senha: string;
    email: string;
    operador: boolean;
    recomendate: boolean;
    ativo: boolean;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_dirty: boolean;
    server_id: number | null;
}

type UserDatabaseRaw = Omit<UserDatabase, "operador" | "recomendate" | "ativo" | "is_dirty"> & {
  operador: number;
  recomendate: number;
  ativo: number;
  is_dirty: number;
};

function mapUser(row: UserDatabaseRaw): UserDatabase {
  return {
    ...row,
    operador: row.operador === 1,
    recomendate: row.recomendate === 1,
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
                $recomendante: data.recomendate ? 1 : 0,
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            return { insertedRowId }
        } catch (error) {
            throw error
        }finally{
            await statement.finalizeAsync();
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



    return { create, getByCrendentials }
}