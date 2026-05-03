class AddOrigemToMovimentacaoEstoqueInsumos < ActiveRecord::Migration[8.1]
  def change
    add_column :movimentacao_estoque_insumos, :origem, :string
  end
end
