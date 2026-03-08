class AtividadeSafra < ApplicationRecord
  belongs_to :atividade
  belongs_to :safra
  belongs_to :propriedade
end
