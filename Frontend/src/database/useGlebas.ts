import { useSQLiteContext } from "expo-sqlite";
import { Ponto } from "../util/Ponto";

export type UseGleba = {
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
    deleted_at: string | null
}

type UseGlebaRaw = Omit<UseGleba, "ativo" | "is_dirty"> & {
    ativo: number,
    is_dirty: number
}

type GlebaLatLong = {
    latitude: number;
    longitude: number;
};

type GlebaComPontos = {
    id: number;
    descricao: string;
    latitude: number;
    longitude: number;
    ordem: number;
}



function mapGleba(row: UseGlebaRaw): UseGleba {
    return {
        ...row,
        ativo: row.ativo === 1,
        is_dirty: row.is_dirty === 1
    };
}

export function useGlebaDatabase() {
    const database = useSQLiteContext();

    async function create(
        data: Pick<UseGleba, "propriedade_id" | "descricao" | "area_hectares">
    ) {
        const statement = await database.prepareAsync(`
            INSERT INTO glebas 
            (descricao, area_hectares, propriedade_id, ativo, created_at, updated_at, is_dirty)
            VALUES ($descricao, $area_hectares, $propriedade_id, 1, datetime('now'), datetime('now'), 1)
        `);

        try {
            const result = await statement.executeAsync({
                $descricao: data.descricao,
                $area_hectares: data.area_hectares,
                $propriedade_id: data.propriedade_id,
            });

            const insertedRowId = result.lastInsertRowId;

            return { insertedRowId };
        } catch (error) {
            console.log("Erro ao cadastrar gleba", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getGlebasWithLatLong(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<GlebaLatLong>(
                `SELECT gp.latitude, gp.longitude 
                 FROM gleba_pontos gp
                 INNER JOIN glebas g ON g.id = gp.gleba_id
                 WHERE g.propriedade_id = $propriedade_id
                 LIMIT 1`,
                { $propriedade_id: propriedade_id }
            );

            return rows;
        } catch (error) {
            console.error("Erro ao buscar coordenadas da gleba:", error);
            throw error;
        }
    }

    async function createPontos(gleba_id: number, pontos: Ponto[]) {
        const statement = await database.prepareAsync(`
            INSERT INTO gleba_pontos 
            (latitude, longitude, ordem, gleba_id, created_at, updated_at, is_dirty)
            VALUES ($latitude, $longitude, $ordem, $gleba_id, datetime('now'), datetime('now'), 1)
        `);

        try {
            for (let i = 0; i < pontos.length; i++) {
                await statement.executeAsync({
                    $latitude: pontos[i].latitude,
                    $longitude: pontos[i].longitude,
                    $ordem: i + 1,
                    $gleba_id: gleba_id,
                });
            }
        } catch (error) {
            console.error("Erro ao salvar pontos", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function createGlebaWithPontos(
        data: Pick<UseGleba, "propriedade_id" | "descricao" | "area_hectares">,
        pontos: Ponto[]
    ) {
        const result = await create(data);

        if (!result?.insertedRowId) {
            throw new Error("Erro ao criar gleba");
        }

        await createPontos(result.insertedRowId, pontos);

        return result;
    }

    async function getGlebasInActivity(atividade_safra_id: number) {
        try {
            const rows = await database.getAllAsync<GlebaComPontos>(
                `SELECT g.id, g.descricao, gp.latitude, gp.longitude, gp.ordem 
                FROM glebas g
                INNER JOIN gleba_pontos gp ON g.id = gp.gleba_id
                INNER JOIN atividade_glebas ag ON g.id = ag.gleba_id
                WHERE ag.atividade_safra_id = $id
                ORDER BY g.id, gp.ordem ASC`,
                { $id: atividade_safra_id }
            );
            return rows;
        } catch (error) {
            console.error("Erro ao localizar glebas da atividade", error);
            throw error;
        }
    }

    return {
        create,
        createPontos,
        createGlebaWithPontos,
        getGlebasWithLatLong,
        getGlebasInActivity
    };
}