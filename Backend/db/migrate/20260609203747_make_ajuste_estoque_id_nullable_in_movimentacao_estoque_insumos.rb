class MakeAjusteEstoqueIdNullableInMovimentacaoEstoqueInsumos < ActiveRecord::Migration[8.1]
  def change
    change_column_null :movimentacao_estoque_insumos, :ajuste_estoque_id, true
  end
end
