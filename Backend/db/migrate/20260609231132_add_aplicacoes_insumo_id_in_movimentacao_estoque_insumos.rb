class AddAplicacoesInsumoIdInMovimentacaoEstoqueInsumos < ActiveRecord::Migration[8.1]
  def change
  add_reference :movimentacao_estoque_insumos, :aplicacoes_insumo, foreign_key: true, null: true
  end
end
