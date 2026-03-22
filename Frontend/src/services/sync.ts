import { SQLiteDatabase } from 'expo-sqlite';
import { syncUsuarios } from "./syncUsuarios";

export async function syncAll(database: SQLiteDatabase) {
    await syncUsuarios(database);
}