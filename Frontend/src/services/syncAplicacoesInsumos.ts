import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncAplicacoesInsumos(database: SQLiteDatabase) {
    const token = await getToken();

    const aplicacoes = await database.getAllAsync<{
        id: number;
        atividade_safra_id: number;
        atividade_gleba_id: number;
        maquina_id: number;
        operador_id: number;
        recomendacoes_agricolas_id: number | null;
        area_aplic: number | null;
        data_inicio: string;
        data_final: string;
        ativo: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM aplicacoes_insumos WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('AplicacoesInsumos dirty:', aplicacoes.length);

    if (aplicacoes.length) {
        const aplicacoesComIds = await Promise.all(
            aplicacoes.map(async (aplic) => {
                const [atividadeSafra, atividadeGleba, maquina, operador, recomendacao] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM atividade_safras WHERE id = $id`, { $id: aplic.atividade_safra_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM atividade_glebas WHERE id = $id`, { $id: aplic.atividade_gleba_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM maquinas WHERE id = $id`, { $id: aplic.maquina_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM usuarios WHERE id = $id`, { $id: aplic.operador_id }),
                    aplic.recomendacoes_agricolas_id
                        ? database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM recomendacoes_agricolas WHERE id = $id`, { $id: aplic.recomendacoes_agricolas_id })
                        : Promise.resolve(null),
                ]);
                return {
                    ...aplic,
                    atividade_safra_id: atividadeSafra?.server_id,
                    atividade_gleba_id: atividadeGleba?.server_id,
                    maquina_id: maquina?.server_id,
                    operador_id: operador?.server_id,
                    recomendacoes_agricolas_id: recomendacao?.server_id ?? null,
                };
            })
        );

        for (const aplic of aplicacoesComIds) {
            if (!aplic.atividade_safra_id || !aplic.atividade_gleba_id || !aplic.maquina_id || !aplic.operador_id) {
                console.warn(`[aplicacoes_insumos] local id ${aplic.id} ignorado no PUSH — server_id de FK faltando:`, {
                    atividade_safra_id: aplic.atividade_safra_id,
                    atividade_gleba_id: aplic.atividade_gleba_id,
                    maquina_id: aplic.maquina_id,
                    operador_id: aplic.operador_id,
                });
                continue;
            }

            if (aplic.server_id) {
                const response = await fetch(`${API_URL}/aplicacoes_insumos/${aplic.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ aplicacao_insumo: { atividade_safra_id: aplic.atividade_safra_id, atividade_gleba_id: aplic.atividade_gleba_id, maquina_id: aplic.maquina_id, operador_id: aplic.operador_id, recomendacoes_agricolas_id: aplic.recomendacoes_agricolas_id, area_aplic: aplic.area_aplic, data_inicio: aplic.data_inicio, data_final: aplic.data_final, ativo: aplic.ativo, deleted_at: aplic.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE aplicacoes_insumos SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: aplic.id }
                    );
                    console.log(`AplicacaoInsumo ${aplic.id} atualizada no servidor!`);
                } else {
                    const body = await response.text();
                    console.warn(`[aplicacoes_insumos] PUT ${aplic.server_id} retornou ${response.status}:`, body);
                }
            } else {
                const response = await fetch(`${API_URL}/aplicacoes_insumos/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ aplicacoes_insumos: [aplic] })
                });
                const responseText = await response.text();
                let data: any = {};
                try { data = JSON.parse(responseText); } catch { console.warn(`[aplicacoes_insumos] POST resposta não-JSON (${response.status}):`, responseText); }
                if (data.aplicacoes_insumos?.[0]) {
                    await database.runAsync(
                        `UPDATE aplicacoes_insumos SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.aplicacoes_insumos[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: aplic.id }
                    );
                    console.log(`AplicacaoInsumo ${aplic.id} criada no servidor!`);
                } else {
                    console.warn(`[aplicacoes_insumos] POST retornou ${response.status}, sem id:`, responseText);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM aplicacoes_insumos`);
    const url = ultimaSync?.synced_at ? `${API_URL}/aplicacoes_insumos?updated_after=${ultimaSync.synced_at}` : `${API_URL}/aplicacoes_insumos`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const aplicacoesServidor = Array.isArray(rawData) ? rawData : rawData.aplicacoes_insumos;

    for (const a of aplicacoesServidor ?? []) {
        const [atividadeSafraLocal, atividadeGlebaLocal, maquinaLocal, operadorLocal, recomendacaoLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_safras WHERE server_id = $server_id`, { $server_id: a.atividade_safra_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_glebas WHERE server_id = $server_id`, { $server_id: a.atividade_gleba_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM maquinas WHERE server_id = $server_id`, { $server_id: a.maquina_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM usuarios WHERE server_id = $server_id`, { $server_id: a.operador_id }),
            a.recomendacoes_agricolas_id ? database.getFirstAsync<{ id: number }>(`SELECT id FROM recomendacoes_agricolas WHERE server_id = $server_id`, { $server_id: a.recomendacoes_agricolas_id }) : Promise.resolve(null),
            database.getFirstAsync(`SELECT id FROM aplicacoes_insumos WHERE server_id = $server_id`, { $server_id: a.id }),
        ]);

        if (!atividadeSafraLocal || !atividadeGlebaLocal || !maquinaLocal || !operadorLocal) {
            console.warn(`[aplicacoes_insumos] server_id ${a.id} ignorado — deps faltando:`, {
                atividade_safra: { id: a.atividade_safra_id, ok: !!atividadeSafraLocal },
                atividade_gleba: { id: a.atividade_gleba_id, ok: !!atividadeGlebaLocal },
                maquina: { id: a.maquina_id, ok: !!maquinaLocal },
                operador: { id: a.operador_id, ok: !!operadorLocal },
            });
            continue;
        }

        const recomendacaoLocalId = recomendacaoLocal?.id ?? null;

        if (existeLocal) {
            await database.runAsync(`UPDATE aplicacoes_insumos SET atividade_safra_id = $atividade_safra_id, atividade_gleba_id = $atividade_gleba_id, maquina_id = $maquina_id, operador_id = $operador_id, recomendacoes_agricolas_id = $recomendacoes_agricolas_id, area_aplic = $area_aplic, data_inicio = $data_inicio, data_final = $data_final, ativo = $ativo, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $atividade_safra_id: atividadeSafraLocal.id, $atividade_gleba_id: atividadeGlebaLocal.id, $maquina_id: maquinaLocal.id, $operador_id: operadorLocal.id, $recomendacoes_agricolas_id: recomendacaoLocalId, $area_aplic: a.area_aplic ?? null, $data_inicio: a.data_inicio, $data_final: a.data_final, $ativo: a.ativo ? 1 : 0, $deleted_at: a.deleted_at ?? null, $updated_at: a.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: a.id }
            );
            console.log(`AplicacaoInsumo ${a.id} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO aplicacoes_insumos (atividade_safra_id, atividade_gleba_id, maquina_id, operador_id, recomendacoes_agricolas_id, area_aplic, data_inicio, data_final, ativo, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($atividade_safra_id, $atividade_gleba_id, $maquina_id, $operador_id, $recomendacoes_agricolas_id, $area_aplic, $data_inicio, $data_final, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $atividade_safra_id: atividadeSafraLocal.id, $atividade_gleba_id: atividadeGlebaLocal.id, $maquina_id: maquinaLocal.id, $operador_id: operadorLocal.id, $recomendacoes_agricolas_id: recomendacaoLocalId, $area_aplic: a.area_aplic ?? null, $data_inicio: a.data_inicio, $data_final: a.data_final, $ativo: a.ativo ? 1 : 0, $server_id: a.id, $created_at: a.created_at, $updated_at: a.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: a.deleted_at ?? null }
            );
            console.log(`AplicacaoInsumo ${a.id} inserida localmente!`);
        }
    }

    console.log('Sincronização de aplicacoes_insumos concluída!');
}
