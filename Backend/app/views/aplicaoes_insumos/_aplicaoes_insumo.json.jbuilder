json.extract! aplicaoes_insumo, :id, :propriedade_id, :atividade_id, :atividade_safra_id, :atividade_gleba_id, :usuario_id, :maquina_id, :operador, :recomendacoes_agricola_id, :area_aplic, :data_inicio, :data_final, :created_at, :updated_at
json.url aplicaoes_insumo_url(aplicaoes_insumo, format: :json)
