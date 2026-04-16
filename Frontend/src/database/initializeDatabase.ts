import {type SQLiteDatabase} from 'expo-sqlite'
import { seedEstadosCidades } from './cityStateDatabase';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS estados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      codigo_ibge INTEGER,
      sigla TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS cidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      codigo_ibge INTEGER,
      latitude REAL,
      longitude REAL,
      estado_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (estado_id) REFERENCES estados(id)
    );

    CREATE TABLE IF NOT EXISTS propriedades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      hectare REAL,
      ativo NTEGER DEFAULT 1,
      cidade_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (cidade_id) REFERENCES cidades(id)
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE,
      usuario TEXT UNIQUE,
      senha TEXT,
      email TEXT UNIQUE,
      operador INTEGER,
      recomendante INTEGER,
      ativo INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    
    INSERT OR IGNORE INTO usuarios (
      id, nome, usuario, senha, email, operador, recomendante, ativo,
      created_at, updated_at, synced_at, is_dirty, server_id, deleted_at
    ) VALUES (
      10, 'khronos_adm', 'khronos_adm', '749b6911bf2bbd920781343120d2d4603db44d5958555cbea16e241a8098639a', 'admin@admin', 1, 1, 1,
      datetime('now'), datetime('now'), NULL, 1, NULL, NULL
    );


    CREATE TABLE IF NOT EXISTS safras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      data_inicio TEXT,
      data_final TEXT,
      ativo INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS atividades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      cor TEXT,
      ativo INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS maquinas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      ativo INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS nutrientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      sigla TEXT UNIQUE,
      unidade TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS principios_ativos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      ativo INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS principios_ativos_nutrientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      principios_ativo_id INTEGER NOT NULL,
      nutriente_id INTEGER NOT NULL,
      percentual REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (principios_ativo_id) REFERENCES principios_ativos(id),
      FOREIGN KEY (nutriente_id) REFERENCES nutrientes(id)
    );

    CREATE TABLE IF NOT EXISTS unidades_medidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      sigla TEXT UNIQUE,
      ativo INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    INSERT OR IGNORE INTO unidades_medidas (
      id, descricao, sigla, ativo, created_at, updated_at, synced_at, is_dirty, server_id, deleted_at
    ) VALUES 
      (1, 'Litros', 'L', 1, datetime('now'), datetime('now'), NULL, 1, NULL, NULL),
      (2, 'Quilos', 'Kg', 1, datetime('now'), datetime('now'), NULL, 1, NULL, NULL),
      (3, 'Unidades', 'Un', 1, datetime('now'), datetime('now'), NULL, 1, NULL, NULL);


    CREATE TABLE IF NOT EXISTS insumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      semente INTEGER,
      ativo INTEGER,
      unidades_medida_id INTEGER NOT NULL,
      principios_ativos_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (unidades_medida_id) REFERENCES unidades_medidas(id),
      FOREIGN KEY (principios_ativos_id) REFERENCES principios_ativos(id)
    );

    CREATE TABLE IF NOT EXISTS glebas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT UNIQUE,
      ativo INTEGER,
      area_hectares REAL,
      propriedade_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (propriedade_id) REFERENCES propriedades(id)
    );

    CREATE TABLE IF NOT EXISTS gleba_pontos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL,
      longitude REAL,
      ordem INTEGER,
      gleba_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (gleba_id) REFERENCES glebas(id)
    );

    CREATE TABLE IF NOT EXISTS atividade_safras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      atividade_id INTEGER NOT NULL,
      safra_id INTEGER NOT NULL,
      propriedade_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (atividade_id) REFERENCES atividades(id),
      FOREIGN KEY (safra_id) REFERENCES safras(id),
      FOREIGN KEY (propriedade_id) REFERENCES propriedades(id)
    );

    CREATE TABLE IF NOT EXISTS atividade_glebas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gleba_id INTEGER NOT NULL,
      atividade_safra_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (gleba_id) REFERENCES glebas(id),
      FOREIGN KEY (atividade_safra_id) REFERENCES atividade_safras(id)
    );

    CREATE TABLE IF NOT EXISTS ajuste_estoques (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      propriedade_id INTEGER NOT NULL,
      observacao TEXT,
      data TEXT,
      entrada_saida TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (propriedade_id) REFERENCES propriedades(id)
    );

    CREATE TABLE IF NOT EXISTS movimentacao_estoque_insumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quantidade REAL,
      valor_unitario REAL,
      ajuste_estoque_id INTEGER NOT NULL,
      insumo_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (ajuste_estoque_id) REFERENCES ajuste_estoques(id),
      FOREIGN KEY (insumo_id) REFERENCES insumos(id)
    );

    CREATE TABLE IF NOT EXISTS parametros_metricas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT,
      descricao TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS fichamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parametros_metrica_id INTEGER NOT NULL,
      classificacao TEXT,
      valor_min REAL,
      valor_max REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (parametros_metrica_id) REFERENCES parametros_metricas(id)
    );

    CREATE TABLE IF NOT EXISTS analises_solos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      propriedade_id INTEGER NOT NULL,
      safra_id INTEGER NOT NULL,
      atividade_id INTEGER NOT NULL,
      atividade_gleba_id INTEGER NOT NULL,
      atividade_safra_id INTEGER NOT NULL,
      data_coleta TEXT,
      ativo INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (propriedade_id) REFERENCES propriedades(id),
      FOREIGN KEY (safra_id) REFERENCES safras(id),
      FOREIGN KEY (atividade_id) REFERENCES atividades(id),
      FOREIGN KEY (atividade_gleba_id) REFERENCES atividade_glebas(id),
      FOREIGN KEY (atividade_safra_id) REFERENCES atividade_safras(id)
    );

    CREATE TABLE IF NOT EXISTS analises_solo_resultados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analises_solo_id INTEGER NOT NULL,
      parametro_medido TEXT,
      parametro_medido_id INTEGER,
      valor REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (analises_solo_id) REFERENCES analises_solos(id)
    );

    CREATE TABLE IF NOT EXISTS recomendacoes_agricolas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      safra_id INTEGER NOT NULL,
      atividade_id INTEGER NOT NULL,
      analises_solo_id INTEGER,
      propriedade_id INTEGER NOT NULL,
      atividade_gleba_id INTEGER NOT NULL,
      atividade_safra_id INTEGER NOT NULL,
      data_recomendacao TEXT,
      recomendante TEXT,
      operador TEXT,
      ativo INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (safra_id) REFERENCES safras(id),
      FOREIGN KEY (atividade_id) REFERENCES atividades(id),
      FOREIGN KEY (analises_solo_id) REFERENCES analises_solos(id),
      FOREIGN KEY (propriedade_id) REFERENCES propriedades(id),
      FOREIGN KEY (atividade_gleba_id) REFERENCES atividade_glebas(id),
      FOREIGN KEY (atividade_safra_id) REFERENCES atividade_safras(id)
    );

    CREATE TABLE IF NOT EXISTS recomendacoes_agricolas_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recomendacao_agricola_id INTEGER NOT NULL,
      principios_ativo_id INTEGER NOT NULL,
      insumo_id INTEGER NOT NULL,
      dose REAL,
      quantidade REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (recomendacao_agricola_id) REFERENCES recomendacoes_agricolas(id),
      FOREIGN KEY (principios_ativo_id) REFERENCES principios_ativos(id),
      FOREIGN KEY (insumo_id) REFERENCES insumos(id)
    );

    CREATE TABLE IF NOT EXISTS aplicaoes_insumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      propriedade_id INTEGER NOT NULL,
      atividade_id INTEGER NOT NULL,
      atividade_safra_id INTEGER NOT NULL,
      atividade_gleba_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      maquina_id INTEGER NOT NULL,
      operador TEXT,
      recomendacoes_agricolas_id INTEGER,
      area_aplic REAL,
      data_inicio TEXT,
      data_final TEXT,
      ativo INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (propriedade_id) REFERENCES propriedades(id),
      FOREIGN KEY (atividade_id) REFERENCES atividades(id),
      FOREIGN KEY (atividade_safra_id) REFERENCES atividade_safras(id),
      FOREIGN KEY (atividade_gleba_id) REFERENCES atividade_glebas(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (maquina_id) REFERENCES maquinas(id),
      FOREIGN KEY (recomendacoes_agricolas_id) REFERENCES recomendacoes_agricolas(id)
    );

    CREATE TABLE IF NOT EXISTS aplicacoes_itens_insumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aplicaoes_insumo_id INTEGER NOT NULL,
      principios_ativo_id INTEGER NOT NULL,
      insumo_id INTEGER NOT NULL,
      quantidade_aplic REAL,
      dose_aplic REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_dirty INTEGER DEFAULT 1,
      server_id INTEGER,
      deleted_at TEXT,
      FOREIGN KEY (aplicaoes_insumo_id) REFERENCES aplicaoes_insumos(id),
      FOREIGN KEY (principios_ativo_id) REFERENCES principios_ativos(id),
      FOREIGN KEY (insumo_id) REFERENCES insumos(id)
    );
  `);

  //cria as cidades e estados
  await seedEstadosCidades(db);
}