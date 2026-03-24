# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_22_042822) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "ajuste_estoques", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "data"
    t.string "entrada_saida", limit: 1
    t.string "observacao"
    t.bigint "propriedade_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "usuario_id", null: false
    t.index ["propriedade_id"], name: "index_ajuste_estoques_on_propriedade_id"
    t.index ["usuario_id"], name: "index_ajuste_estoques_on_usuario_id"
  end

  create_table "analises_solo_resultados", force: :cascade do |t|
    t.bigint "analises_solo_id", null: false
    t.datetime "created_at", null: false
    t.string "parametro_medido"
    t.integer "parametro_medido_id"
    t.datetime "updated_at", null: false
    t.decimal "valor", precision: 10, scale: 2
    t.index ["analises_solo_id"], name: "index_analises_solo_resultados_on_analises_solo_id"
  end

  create_table "analises_solos", force: :cascade do |t|
    t.bigint "atividade_gleba_id", null: false
    t.bigint "atividade_id", null: false
    t.bigint "atividade_safra_id", null: false
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "data_coleta"
    t.bigint "propriedade_id", null: false
    t.bigint "safra_id", null: false
    t.datetime "updated_at", null: false
    t.index ["atividade_gleba_id"], name: "index_analises_solos_on_atividade_gleba_id"
    t.index ["atividade_id"], name: "index_analises_solos_on_atividade_id"
    t.index ["atividade_safra_id"], name: "index_analises_solos_on_atividade_safra_id"
    t.index ["propriedade_id"], name: "index_analises_solos_on_propriedade_id"
    t.index ["safra_id"], name: "index_analises_solos_on_safra_id"
  end

  create_table "aplicacoes_itens_insumos", force: :cascade do |t|
    t.bigint "aplicaoes_insumo_id", null: false
    t.datetime "created_at", null: false
    t.decimal "dose_aplic", precision: 10, scale: 2
    t.bigint "insumo_id", null: false
    t.bigint "principios_ativo_id", null: false
    t.decimal "quantidade_aplic", precision: 10, scale: 2
    t.datetime "updated_at", null: false
    t.index ["aplicaoes_insumo_id"], name: "index_aplicacoes_itens_insumos_on_aplicaoes_insumo_id"
    t.index ["insumo_id"], name: "index_aplicacoes_itens_insumos_on_insumo_id"
    t.index ["principios_ativo_id"], name: "index_aplicacoes_itens_insumos_on_principios_ativo_id"
  end

  create_table "aplicaoes_insumos", force: :cascade do |t|
    t.decimal "area_aplic", precision: 10, scale: 2
    t.bigint "atividade_gleba_id", null: false
    t.bigint "atividade_id", null: false
    t.bigint "atividade_safra_id", null: false
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "data_final"
    t.datetime "data_inicio"
    t.bigint "maquina_id", null: false
    t.string "operador"
    t.bigint "propriedade_id", null: false
    t.bigint "recomendacoes_agricolas_id"
    t.datetime "updated_at", null: false
    t.bigint "usuario_id", null: false
    t.index ["atividade_gleba_id"], name: "index_aplicaoes_insumos_on_atividade_gleba_id"
    t.index ["atividade_id"], name: "index_aplicaoes_insumos_on_atividade_id"
    t.index ["atividade_safra_id"], name: "index_aplicaoes_insumos_on_atividade_safra_id"
    t.index ["maquina_id"], name: "index_aplicaoes_insumos_on_maquina_id"
    t.index ["propriedade_id"], name: "index_aplicaoes_insumos_on_propriedade_id"
    t.index ["recomendacoes_agricolas_id"], name: "index_aplicaoes_insumos_on_recomendacoes_agricolas_id"
    t.index ["usuario_id"], name: "index_aplicaoes_insumos_on_usuario_id"
  end

  create_table "atividade_glebas", force: :cascade do |t|
    t.bigint "atividade_safra_id", null: false
    t.datetime "created_at", null: false
    t.bigint "gleba_id", null: false
    t.datetime "updated_at", null: false
    t.index ["atividade_safra_id"], name: "index_atividade_glebas_on_atividade_safra_id"
    t.index ["gleba_id"], name: "index_atividade_glebas_on_gleba_id"
  end

  create_table "atividade_safras", force: :cascade do |t|
    t.bigint "atividade_id", null: false
    t.datetime "created_at", null: false
    t.bigint "propriedade_id", null: false
    t.bigint "safra_id", null: false
    t.datetime "updated_at", null: false
    t.index ["atividade_id"], name: "index_atividade_safras_on_atividade_id"
    t.index ["propriedade_id"], name: "index_atividade_safras_on_propriedade_id"
    t.index ["safra_id"], name: "index_atividade_safras_on_safra_id"
  end

  create_table "atividades", force: :cascade do |t|
    t.boolean "ativo"
    t.string "cor"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.datetime "updated_at", null: false
  end

  create_table "cidades", force: :cascade do |t|
    t.integer "codigo_ibge"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.bigint "estado_id", null: false
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.datetime "updated_at", null: false
    t.index ["estado_id"], name: "index_cidades_on_estado_id"
  end

  create_table "estados", force: :cascade do |t|
    t.integer "codigo_ibge"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.string "sigla"
    t.datetime "updated_at", null: false
  end

  create_table "fichamentos", force: :cascade do |t|
    t.string "classificacao"
    t.datetime "created_at", null: false
    t.bigint "parametros_metrica_id", null: false
    t.datetime "updated_at", null: false
    t.decimal "valor_max", precision: 6, scale: 2
    t.decimal "valor_min", precision: 6, scale: 2
    t.index ["parametros_metrica_id"], name: "index_fichamentos_on_parametros_metrica_id"
  end

  create_table "gleba_pontos", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "gleba_id", null: false
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.integer "ordem"
    t.datetime "updated_at", null: false
    t.index ["gleba_id"], name: "index_gleba_pontos_on_gleba_id"
  end

  create_table "glebas", force: :cascade do |t|
    t.decimal "area_hectares", precision: 10, scale: 2
    t.boolean "ativo"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.bigint "propriedade_id", null: false
    t.datetime "updated_at", null: false
    t.index ["propriedade_id"], name: "index_glebas_on_propriedade_id"
  end

  create_table "insumos", force: :cascade do |t|
    t.boolean "ativo"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.bigint "principios_ativos_id", null: false
    t.boolean "semente"
    t.bigint "unidades_medida_id", null: false
    t.datetime "updated_at", null: false
    t.index ["principios_ativos_id"], name: "index_insumos_on_principios_ativos_id"
    t.index ["unidades_medida_id"], name: "index_insumos_on_unidades_medida_id"
  end

  create_table "maquinas", force: :cascade do |t|
    t.boolean "ativo"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.datetime "updated_at", null: false
  end

  create_table "movimentacao_estoque_insumos", force: :cascade do |t|
    t.bigint "ajuste_estoque_id", null: false
    t.datetime "created_at", null: false
    t.bigint "insumo_id", null: false
    t.decimal "quantidade", precision: 10, scale: 2
    t.datetime "updated_at", null: false
    t.decimal "valor_unitario", precision: 10, scale: 2
    t.index ["ajuste_estoque_id"], name: "index_movimentacao_estoque_insumos_on_ajuste_estoque_id"
    t.index ["insumo_id"], name: "index_movimentacao_estoque_insumos_on_insumo_id"
  end

  create_table "nutrientes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "descricao"
    t.string "sigla"
    t.string "unidade"
    t.datetime "updated_at", null: false
  end

  create_table "parametros_metricas", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "descricao"
    t.string "tipo", limit: 1
    t.datetime "updated_at", null: false
  end

  create_table "principios_ativos", force: :cascade do |t|
    t.boolean "ativo"
    t.datetime "created_at", null: false
    t.string "descricao"
    t.datetime "updated_at", null: false
  end

  create_table "principios_ativos_nutrientes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "nutriente_id", null: false
    t.decimal "percentual", precision: 5, scale: 2
    t.bigint "principios_ativo_id", null: false
    t.datetime "updated_at", null: false
    t.index ["nutriente_id"], name: "index_principios_ativos_nutrientes_on_nutriente_id"
    t.index ["principios_ativo_id"], name: "index_principios_ativos_nutrientes_on_principios_ativo_id"
  end

  create_table "propriedades", force: :cascade do |t|
    t.boolean "ativo", default: true, null: false
    t.bigint "cidade_id", null: false
    t.datetime "created_at", null: false
    t.string "descricao"
    t.decimal "hectare", precision: 10, scale: 2
    t.datetime "updated_at", null: false
    t.index ["cidade_id"], name: "index_propriedades_on_cidade_id"
  end

  create_table "recomendacoes_agricolas", force: :cascade do |t|
    t.bigint "analises_solo_id"
    t.bigint "atividade_gleba_id", null: false
    t.bigint "atividade_id", null: false
    t.bigint "atividade_safra_id", null: false
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "data_recomendacao"
    t.string "operador"
    t.bigint "propriedade_id", null: false
    t.string "recomendante"
    t.bigint "safra_id", null: false
    t.datetime "updated_at", null: false
    t.index ["analises_solo_id"], name: "index_recomendacoes_agricolas_on_analises_solo_id"
    t.index ["atividade_gleba_id"], name: "index_recomendacoes_agricolas_on_atividade_gleba_id"
    t.index ["atividade_id"], name: "index_recomendacoes_agricolas_on_atividade_id"
    t.index ["atividade_safra_id"], name: "index_recomendacoes_agricolas_on_atividade_safra_id"
    t.index ["propriedade_id"], name: "index_recomendacoes_agricolas_on_propriedade_id"
    t.index ["safra_id"], name: "index_recomendacoes_agricolas_on_safra_id"
  end

  create_table "recomendacoes_agricolas_itens", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.decimal "dose", precision: 10, scale: 2
    t.bigint "insumo_id", null: false
    t.bigint "principios_ativo_id", null: false
    t.decimal "quantidade", precision: 10, scale: 2
    t.bigint "recomendacao_agricola_id", null: false
    t.datetime "updated_at", null: false
    t.index ["insumo_id"], name: "index_recomendacoes_agricolas_itens_on_insumo_id"
    t.index ["principios_ativo_id"], name: "index_recomendacoes_agricolas_itens_on_principios_ativo_id"
    t.index ["recomendacao_agricola_id"], name: "idx_on_recomendacao_agricola_id_8962a960ec"
  end

  create_table "safras", force: :cascade do |t|
    t.boolean "ativo"
    t.datetime "created_at", null: false
    t.date "data_final"
    t.date "data_inicio"
    t.string "descricao"
    t.datetime "updated_at", null: false
  end

  create_table "unidades_medidas", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "descricao"
    t.datetime "updated_at", null: false
  end

  create_table "usuarios", force: :cascade do |t|
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.string "email"
    t.string "nome"
    t.boolean "operador"
    t.boolean "recomendate"
    t.string "senha"
    t.integer "server_id"
    t.datetime "updated_at", null: false
    t.string "usuario"
  end

  add_foreign_key "ajuste_estoques", "propriedades"
  add_foreign_key "ajuste_estoques", "usuarios"
  add_foreign_key "analises_solo_resultados", "analises_solos"
  add_foreign_key "analises_solos", "atividade_glebas"
  add_foreign_key "analises_solos", "atividade_safras"
  add_foreign_key "analises_solos", "atividades"
  add_foreign_key "analises_solos", "propriedades"
  add_foreign_key "analises_solos", "safras"
  add_foreign_key "aplicacoes_itens_insumos", "aplicaoes_insumos"
  add_foreign_key "aplicacoes_itens_insumos", "insumos"
  add_foreign_key "aplicacoes_itens_insumos", "principios_ativos"
  add_foreign_key "aplicaoes_insumos", "atividade_glebas"
  add_foreign_key "aplicaoes_insumos", "atividade_safras"
  add_foreign_key "aplicaoes_insumos", "atividades"
  add_foreign_key "aplicaoes_insumos", "maquinas"
  add_foreign_key "aplicaoes_insumos", "propriedades"
  add_foreign_key "aplicaoes_insumos", "recomendacoes_agricolas", column: "recomendacoes_agricolas_id"
  add_foreign_key "aplicaoes_insumos", "usuarios"
  add_foreign_key "atividade_glebas", "atividade_safras"
  add_foreign_key "atividade_glebas", "glebas"
  add_foreign_key "atividade_safras", "atividades"
  add_foreign_key "atividade_safras", "propriedades"
  add_foreign_key "atividade_safras", "safras"
  add_foreign_key "cidades", "estados"
  add_foreign_key "fichamentos", "parametros_metricas"
  add_foreign_key "gleba_pontos", "glebas"
  add_foreign_key "glebas", "propriedades"
  add_foreign_key "insumos", "principios_ativos", column: "principios_ativos_id"
  add_foreign_key "insumos", "unidades_medidas"
  add_foreign_key "movimentacao_estoque_insumos", "ajuste_estoques"
  add_foreign_key "movimentacao_estoque_insumos", "insumos"
  add_foreign_key "principios_ativos_nutrientes", "nutrientes"
  add_foreign_key "principios_ativos_nutrientes", "principios_ativos"
  add_foreign_key "propriedades", "cidades"
  add_foreign_key "recomendacoes_agricolas", "analises_solos"
  add_foreign_key "recomendacoes_agricolas", "atividade_glebas"
  add_foreign_key "recomendacoes_agricolas", "atividade_safras"
  add_foreign_key "recomendacoes_agricolas", "atividades"
  add_foreign_key "recomendacoes_agricolas", "propriedades"
  add_foreign_key "recomendacoes_agricolas", "safras"
  add_foreign_key "recomendacoes_agricolas_itens", "insumos"
  add_foreign_key "recomendacoes_agricolas_itens", "principios_ativos"
  add_foreign_key "recomendacoes_agricolas_itens", "recomendacoes_agricolas", column: "recomendacao_agricola_id"
end
