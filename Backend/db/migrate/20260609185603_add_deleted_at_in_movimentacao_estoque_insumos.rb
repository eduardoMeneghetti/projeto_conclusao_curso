class AddDeletedAtInMovimentacaoEstoqueInsumos < ActiveRecord::Migration[8.1]
  def change
    add_column :movimentacao_estoque_insumos, :deleted_at, :datetime
  end
end
