class Insumo < ApplicationRecord
  belongs_to :unidades_medida
  belongs_to :principios_ativo
end
