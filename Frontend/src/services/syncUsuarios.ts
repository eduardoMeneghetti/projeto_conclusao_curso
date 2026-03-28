// services/syncUsuarios.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { API_URL } from './api';
import { getToken } from './auth';

export async function syncUsuarios(database: SQLiteDatabase) {

    const token = await getToken();

    const usuarios = await database.getAllAsync<{
        id: number;
        nome: string;
        usuario: string;
        senha: string;
        email: string;
        operador: number;
        recomendante: number;
        ativo: number;
        is_dirty: number;
        server_id: number | null;
    }>(`SELECT * FROM usuarios WHERE is_dirty = 1 ORDER BY updated_at ASC`);

    console.log('usuários dirty:', usuarios);

    if (usuarios.length) {
        for (const usuario of usuarios) {

            if (usuario.server_id) {
                console.log(`Atualizando usuario ${usuario.usuario}, com o id ${usuario.server_id} no servidor...`);

                const response = await fetch(`${API_URL}/usuarios/${usuario.server_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        usuario: {
                            nome: usuario.nome,
                            usuario: usuario.usuario,
                            senha: usuario.senha,
                            email: usuario.email,
                            operador: usuario.operador,
                            recomendante: usuario.recomendante,
                            ativo: usuario.ativo,
                        }
                    })
                });

                if (response.status === 200) {
                    await database.runAsync(
                        `UPDATE usuarios 
                 SET synced_at = $synced_at, is_dirty = 0
                 WHERE id = $id`,
                        {
                            $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                            $id: usuario.id
                        }
                    );
                    console.log(`Usuario ${usuario.usuario} atualizado no servidor!`);
                }

            } else {
                console.log(`Criando usuario ${usuario.usuario} no servidor...`);

                const response = await fetch(`${API_URL}/auth/sync_usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuarios: [usuario] })
                });

                const data = await response.json();

                if (data.usuarios?.[0]) {
                    await database.runAsync(
                        `UPDATE usuarios 
                 SET server_id = $server_id, synced_at = $synced_at, is_dirty = 0
                 WHERE id = $id`,
                        {
                            $server_id: data.usuarios[0].id,
                            $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                            $id: usuario.id
                        }
                    );
                    console.log(`Usuario ${usuario.usuario} criado no servidor!`);
                }
            }
        }

    }

    console.log('Buscando atualizações no servidor....');

    const ultimaSync = await database.getFirstAsync<{ synced_at: string }>(
        `SELECT MAX(synced_at) as synced_at FROM usuarios`
    );

    const url = ultimaSync?.synced_at
        ? `${API_URL}/usuarios?updated_after=${ultimaSync.synced_at}`
        : `${API_URL}/usuarios`;

    const responseGet = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const rawData = await responseGet.json();
    const usuariosServidor = Array.isArray(rawData) ? rawData : rawData.usuarios;

    console.log('Usuários recebidos do servidor:', usuariosServidor?.length);

    for (const u of usuariosServidor ?? []) {
        // verifica se já existe localmente pelo server_id
        const existeLocal = await database.getFirstAsync(
            `SELECT id FROM usuarios WHERE server_id = $server_id`,
            { $server_id: u.id }
        );

        if (existeLocal) {
            await database.runAsync(
                `UPDATE usuarios
                 SET nome = $nome,
                     usuario = $usuario,
                     email = $email,
                     operador = $operador,
                     recomendante = $recomendante,
                     ativo = $ativo,
                     updated_at = $updated_at,
                     synced_at = $synced_at,
                     is_dirty = 0
                 WHERE server_id = $server_id`,
                {
                    $nome: u.nome,
                    $usuario: u.usuario,
                    $email: u.email,
                    $operador: u.operador ? 1 : 0,
                    $recomendante: u.recomendante ? 1 : 0,
                    $ativo: u.ativo ? 1 : 0,
                    $updated_at: u.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                    $server_id: u.id
                }
            );
            console.log(`Usuario ${u.usuario} atualizado localmente!`);
        } else {
            // 👇 insere novo registro local
            await database.runAsync(
                `INSERT INTO usuarios 
                 (nome, usuario, senha, email, operador, recomendante, ativo, server_id, created_at, updated_at, synced_at, is_dirty)
                 VALUES ($nome, $usuario, $senha, $email, $operador, $recomendante, $ativo, $server_id, $created_at, $updated_at, $synced_at, 0)`,
                {
                    $nome: u.nome,
                    $usuario: u.usuario,
                    $senha: u.senha,
                    $email: u.email ?? '',
                    $operador: u.operador ? 1 : 0,
                    $recomendante: u.recomendante ? 1 : 0,
                    $ativo: u.ativo ? 1 : 0,
                    $server_id: u.id,
                    $created_at: u.created_at,
                    $updated_at: u.updated_at,
                    $synced_at: new Date().toISOString().replace('T', ' ').split('.')[0],
                }
            );
            console.log(`Usuario ${u.usuario} inserido localmente!`);
        }
    }

    console.log('Sincronização de usuários concluída!');
}