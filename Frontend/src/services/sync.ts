import { SQLiteDatabase } from 'expo-sqlite';
import { syncUsuarios } from "./syncUsuarios";
import { syncEstados } from './syncEstados';
import { syncCidades } from './syncCidades';
import { syncPropriedades } from './syncPropriedades';
import { syncSafras } from './syncSafras';
import { syncAtividades } from './syncAtividades';
import { syncAtividadeSafra } from './syncAtividadesSafra';

export async function syncAll(database: SQLiteDatabase) {
    await syncUsuarios(database);
    await syncEstados(database);
    await syncCidades(database);
    await syncPropriedades(database);
    await syncAtividades(database);
    await syncSafras(database);
    await syncAtividadeSafra(database);
}