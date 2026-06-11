class AplicacoesItensInsumo < ApplicationRecord
  belongs_to :aplicaoes_insumo, foreign_key: :aplicacoes_insumo_id
  belongs_to :principios_ativo
  belongs_to :insumo
end
