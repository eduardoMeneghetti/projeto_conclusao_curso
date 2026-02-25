class RecomendacoesAgricolasIten < ApplicationRecord
  belongs_to :recomendacoes_agricola
  belongs_to :principios_ativos
  belongs_to :insumo
end
