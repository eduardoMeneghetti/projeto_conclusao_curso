class RecomendacoesAgricola < ApplicationRecord
  belongs_to :safra
  belongs_to :atividade
  belongs_to :analises_solo
  belongs_to :propriedade
  belongs_to :atividade_gleba
  belongs_to :atividade_safra
end
