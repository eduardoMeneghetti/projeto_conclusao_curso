import { SQLiteDatabase } from 'expo-sqlite';
import { syncUsuarios } from "./syncUsuarios";
import { syncEstados } from './syncEstados';
import { syncCidades } from './syncCidades';
import { syncPropriedades } from './syncPropriedades';
import { syncNutrientes } from './syncNutrientes';
import { syncParametrosMetricas } from './syncParametrosMetricas';
import { syncPrincipiosAtivos } from './syncPrincipiosAtivos';
import { syncUnidadesMedidas } from './syncUnidadesMedidas';
import { syncMaquinas } from './syncMaquinas';
import { syncPrincipiosAtivosNutrientes } from './syncPrincipiosAtivosNutrientes';
import { syncFichamentos } from './syncFichamentos';
import { syncInsumos } from './syncInsumos';
import { syncAtividades } from './syncAtividades';
import { syncSafras } from './syncSafras';
import { syncAtividadeSafra } from './syncAtividadesSafra';
import { syncGlebas } from './syncGlebas';
import { syncGlebaPontos } from './syncGlebaPontos';
import { syncAtividadeGlebas } from './syncAtividadeGlebas';
import { syncAjusteEstoques } from './syncAjusteEstoques';
import { syncAnaliseSolos } from './syncAnaliseSolos';
import { syncAnaliseSoloResultados } from './syncAnaliseSoloResultados';
import { syncRecomendacoesAgricolas } from './syncRecomendacoesAgricolas';
import { syncRecomendacoesAgricolasItens } from './syncRecomendacoesAgricolasItens';
import { syncAplicacoesInsumos } from './syncAplicacoesInsumos';
import { syncAplicacoesItensInsumos } from './syncAplicacoesItensInsumos';
import { syncMovimentacaoEstoqueInsumos } from './syncMovimentacaoEstoqueInsumos';

async function run(name: string, fn: () => Promise<void>) {
    try {
        await fn();
    } catch (error) {
        console.error(`[sync] FALHOU: ${name}`, error);
        throw error;
    }
}

export async function syncAll(database: SQLiteDatabase) {
    await run('syncUsuarios', () => syncUsuarios(database));
    await run('syncEstados', () => syncEstados(database));
    await run('syncCidades', () => syncCidades(database));
    await run('syncPropriedades', () => syncPropriedades(database));
    await run('syncNutrientes', () => syncNutrientes(database));
    await run('syncParametrosMetricas', () => syncParametrosMetricas(database));
    await run('syncPrincipiosAtivos', () => syncPrincipiosAtivos(database));
    await run('syncUnidadesMedidas', () => syncUnidadesMedidas(database));
    await run('syncMaquinas', () => syncMaquinas(database));
    await run('syncPrincipiosAtivosNutrientes', () => syncPrincipiosAtivosNutrientes(database));
    await run('syncFichamentos', () => syncFichamentos(database));
    await run('syncInsumos', () => syncInsumos(database));
    await run('syncAtividades', () => syncAtividades(database));
    await run('syncSafras', () => syncSafras(database));
    await run('syncAtividadeSafra', () => syncAtividadeSafra(database));
    await run('syncGlebas', () => syncGlebas(database));
    await run('syncGlebaPontos', () => syncGlebaPontos(database));
    await run('syncAtividadeGlebas', () => syncAtividadeGlebas(database));
    await run('syncAjusteEstoques', () => syncAjusteEstoques(database));
    await run('syncAnaliseSolos', () => syncAnaliseSolos(database));
    await run('syncAnaliseSoloResultados', () => syncAnaliseSoloResultados(database));
    await run('syncRecomendacoesAgricolas', () => syncRecomendacoesAgricolas(database));
    await run('syncRecomendacoesAgricolasItens', () => syncRecomendacoesAgricolasItens(database));
    await run('syncAplicacoesInsumos', () => syncAplicacoesInsumos(database));
    await run('syncAplicacoesItensInsumos', () => syncAplicacoesItensInsumos(database));
    await run('syncMovimentacaoEstoqueInsumos', () => syncMovimentacaoEstoqueInsumos(database));
}
