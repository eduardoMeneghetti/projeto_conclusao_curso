class AplicaoesInsumo < ApplicationRecord
  belongs_to :propriedade
  belongs_to :atividade
  belongs_to :atividade_safra
  belongs_to :atividade_gleba
  belongs_to :usuario
  belongs_to :maquina
  belongs_to :recomendacoes_agricola
end
