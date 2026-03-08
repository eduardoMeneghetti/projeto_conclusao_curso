class AnalisesSolo < ApplicationRecord
  belongs_to :propriedade
  belongs_to :safra
  belongs_to :atividade
  belongs_to :aatividade_gleba
  belongs_to :atividade_safra
end
