json.extract! recomendacoes_agricola, :id, :safra_id, :atividade_id, :analises_solo_id, :propriedade_id, :atividade_gleba_id, :atividade_safra_id, :data_recomendacao, :recomendante, :operador, :created_at, :updated_at
json.url recomendacoes_agricola_url(recomendacoes_agricola, format: :json)
