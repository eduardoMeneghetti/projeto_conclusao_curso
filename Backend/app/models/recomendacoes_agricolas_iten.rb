class RecomendacoesAgricolasIten < ApplicationRecord
  belongs_to :recomendacoes_agricola, foreign_key: :recomendacao_agricola_id
  belongs_to :principios_ativo
  belongs_to :insumo
end
