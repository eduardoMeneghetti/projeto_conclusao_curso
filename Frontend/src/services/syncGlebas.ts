import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncGlebas(database: SQLiteDatabase) {

    const token = await getToken();

    const glebas = await database.getAllAsync<{
        id: number,
        descricao: string,
        ativo: boolean,
        area_hectares: number,
        propriedade_id: number,
        created_at: string,
        updated_at: string,
        synced_at: string | null,
        is_dirty: boolean,
        server_id: number | null,
        deleted_at: string | null,
    }>(`SELECT * FROM glebas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('Glebas dirty', glebas.length);

    if (glebas.length) {
        const glebasComPropriedade = await Promise.all(
            glebas.map(async (gleba) => {
                const propriedade = await database.getFirstAsync<{ server_id: number }>(
                    `SELECT server_id FROM propriedades WHERE id = $id`,
                    { $id: gleba.propriedade_id }
                );
                return {
                    ...gleba,
                    propriedade_id: propriedade?.server_id
                };
            })
        );
    }

    for (const gleba of glebas) {

        if (gleba.server_id) {
            console.log(`Atualizando a gleba ${gleba.descricao} no servidor...`);

        }
    }
}