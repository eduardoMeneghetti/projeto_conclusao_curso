class RecomendacoesAgricola < ApplicationRecord
  belongs_to :analises_solo, optional: true
  belongs_to :atividade_gleba
  belongs_to :atividade_safra
  belongs_to :operador, class_name: 'Usuario', foreign_key: :operador_id
  belongs_to :recomendante, class_name: 'Usuario', foreign_key: :recomendante_id
end
