import { SQLiteDatabase } from "expo-sqlite";
import { API_URL } from "./api";
import { getToken } from "./auth";

export async function syncRecomendacoesAgricolas(database: SQLiteDatabase) {
    const token = await getToken();

    const recomendacoes = await database.getAllAsync<{
        id: number;
        atividade_safra_id: number;
        atividade_gleba_id: number;
        analises_solo_id: number | null;
        data_inicio: string;
        data_fim: string;
        recomendante_id: number;
        operador_id: number;
        area_aplic: number;
        status: string;
        origem: string;
        ativo: number;
        created_at: string;
        updated_at: string;
        synced_at: string | null;
        is_dirty: number;
        server_id: number | null;
        deleted_at: string | null;
    }>(`SELECT * FROM recomendacoes_agricolas WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('RecomendacoesAgricolas dirty:', recomendacoes.length);

    if (recomendacoes.length) {
        const recomendacoesComIds = await Promise.all(
            recomendacoes.map(async (rec) => {
                const [atividadeSafra, atividadeGleba, analiseSolo, recomendante, operador] = await Promise.all([
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM atividade_safras WHERE id = $id`, { $id: rec.atividade_safra_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM atividade_glebas WHERE id = $id`, { $id: rec.atividade_gleba_id }),
                    rec.analises_solo_id
                        ? database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM analises_solos WHERE id = $id`, { $id: rec.analises_solo_id })
                        : Promise.resolve(null),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM usuarios WHERE id = $id`, { $id: rec.recomendante_id }),
                    database.getFirstAsync<{ server_id: number }>(`SELECT server_id FROM usuarios WHERE id = $id`, { $id: rec.operador_id }),
                ]);
                return {
                    ...rec,
                    atividade_safra_id: atividadeSafra?.server_id,
                    atividade_gleba_id: atividadeGleba?.server_id,
                    analises_solo_id: analiseSolo?.server_id ?? null,
                    recomendante_id: recomendante?.server_id,
                    operador_id: operador?.server_id,
                };
            })
        );

        for (const rec of recomendacoesComIds) {
            if (rec.server_id) {
                const response = await fetch(`${API_URL}/recomendacoes_agricolas/${rec.server_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ recomendacao_agricola: { atividade_safra_id: rec.atividade_safra_id, atividade_gleba_id: rec.atividade_gleba_id, analises_solo_id: rec.analises_solo_id, data_inicio: rec.data_inicio, data_fim: rec.data_fim, recomendante_id: rec.recomendante_id, operador_id: rec.operador_id, area_aplic: rec.area_aplic, status: rec.status, origem: rec.origem, ativo: rec.ativo, deleted_at: rec.deleted_at } })
                });
                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE recomendacoes_agricolas SET synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: rec.id }
                    );
                    console.log(`RecomendacaoAgricola ${rec.id} atualizada no servidor!`);
                }
            } else {
                const response = await fetch(`${API_URL}/recomendacoes_agricolas/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ recomendacoes_agricolas: [rec] })
                });
                const data = await response.json();
                if (data.recomendacoes_agricolas?.[0]) {
                    await database.runAsync(
                        `UPDATE recomendacoes_agricolas SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0 WHERE id = $id`,
                        { $server_id: data.recomendacoes_agricolas[0].id, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $id: rec.id }
                    );
                    console.log(`RecomendacaoAgricola ${rec.id} criada no servidor!`);
                }
            }
        }
    }

    console.log('Buscando atualizações no servidor...');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(`SELECT MAX(synced_at) as synced_at FROM recomendacoes_agricolas`);
    const url = ultimaSync?.synced_at ? `${API_URL}/recomendacoes_agricolas?updated_after=${ultimaSync.synced_at}` : `${API_URL}/recomendacoes_agricolas`;
    const responseGet = await fetch(url, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
    const rawData = await responseGet.json();
    const recomendacoesServidor = Array.isArray(rawData) ? rawData : rawData.recomendacoes_agricolas;

    for (const r of recomendacoesServidor ?? []) {
        const [atividadeSafraLocal, atividadeGlebaLocal, analiseSoloLocal, recomendanteLocal, operadorLocal, existeLocal] = await Promise.all([
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_safras WHERE server_id = $server_id`, { $server_id: r.atividade_safra_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM atividade_glebas WHERE server_id = $server_id`, { $server_id: r.atividade_gleba_id }),
            r.analises_solo_id ? database.getFirstAsync<{ id: number }>(`SELECT id FROM analises_solos WHERE server_id = $server_id`, { $server_id: r.analises_solo_id }) : Promise.resolve(null),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM usuarios WHERE server_id = $server_id`, { $server_id: r.recomendante_id }),
            database.getFirstAsync<{ id: number }>(`SELECT id FROM usuarios WHERE server_id = $server_id`, { $server_id: r.operador_id }),
            database.getFirstAsync(`SELECT id FROM recomendacoes_agricolas WHERE server_id = $server_id`, { $server_id: r.id }),
        ]);

        if (!atividadeSafraLocal || !atividadeGlebaLocal || !recomendanteLocal || !operadorLocal) {
            console.log(`Dependências não localizadas para RecomendacaoAgricola server_id: ${r.id}`);
            continue;
        }

        const analiseSoloLocalId = analiseSoloLocal?.id ?? null;

        if (existeLocal) {
            await database.runAsync(
                `UPDATE recomendacoes_agricolas SET atividade_safra_id = $atividade_safra_id, atividade_gleba_id = $atividade_gleba_id, analises_solo_id = $analises_solo_id, data_inicio = $data_inicio, data_fim = $data_fim, recomendante_id = $recomendante_id, operador_id = $operador_id, area_aplic = $area_aplic, status = $status, origem = $origem, ativo = $ativo, deleted_at = $deleted_at, updated_at = $updated_at, synced_at = $synced_at, is_dirty = 0 WHERE server_id = $server_id`,
                { $atividade_safra_id: atividadeSafraLocal.id, $atividade_gleba_id: atividadeGlebaLocal.id, $analises_solo_id: analiseSoloLocalId, $data_inicio: r.data_inicio, $data_fim: r.data_fim, $recomendante_id: recomendanteLocal.id, $operador_id: operadorLocal.id, $area_aplic: r.area_aplic, $status: r.status, $origem: r.origem, $ativo: r.ativo ? 1 : 0, $deleted_at: r.deleted_at ?? null, $updated_at: r.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $server_id: r.id }
            );
            console.log(`RecomendacaoAgricola ${r.id} atualizada localmente!`);
        } else {
            await database.runAsync(
                `INSERT INTO recomendacoes_agricolas (atividade_safra_id, atividade_gleba_id, analises_solo_id, data_inicio, data_fim, recomendante_id, operador_id, area_aplic, status, origem, ativo, server_id, created_at, updated_at, synced_at, is_dirty, deleted_at) VALUES ($atividade_safra_id, $atividade_gleba_id, $analises_solo_id, $data_inicio, $data_fim, $recomendante_id, $operador_id, $area_aplic, $status, $origem, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0, $deleted_at)`,
                { $atividade_safra_id: atividadeSafraLocal.id, $atividade_gleba_id: atividadeGlebaLocal.id, $analises_solo_id: analiseSoloLocalId, $data_inicio: r.data_inicio, $data_fim: r.data_fim, $recomendante_id: recomendanteLocal.id, $operador_id: operadorLocal.id, $area_aplic: r.area_aplic, $status: r.status, $origem: r.origem, $ativo: r.ativo ? 1 : 0, $server_id: r.id, $created_at: r.created_at, $updated_at: r.updated_at, $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0], $deleted_at: r.deleted_at ?? null }
            );
            console.log(`RecomendacaoAgricola ${r.id} inserida localmente!`);
        }
    }

    console.log('Sincronização de recomendacoes_agricolas concluída!');
}
