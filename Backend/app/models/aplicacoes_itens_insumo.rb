class AplicacoesItensInsumo < ApplicationRecord
  belongs_to :aplicacoes_insumo
  belongs_to :principios_ativo
  belongs_to :insumo
end
