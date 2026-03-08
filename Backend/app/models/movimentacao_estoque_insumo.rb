class MovimentacaoEstoqueInsumo < ApplicationRecord
  belongs_to :ajuste_estoque
  belongs_to :insumo
end
