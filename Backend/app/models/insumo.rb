class Insumo < ApplicationRecord
  belongs_to :unidades_medida
  belongs_to :principios_ativo, foreign_key: :principios_ativos_id
end
