class MovimentacaoEstoqueInsumo < ApplicationRecord
  belongs_to :ajuste_estoque, optional: true
  belongs_to :insumo
end
