class CreateMovimentacaoEstoqueInsumos < ActiveRecord::Migration[8.1]
  def change
    create_table :movimentacao_estoque_insumos do |t|
      t.decimal :quantidade, precision: 10, scale: 2
      t.decimal :valor_unitario, precision: 10, scale: 2
      t.references :ajuste_estoque, null: false, foreign_key: true
      t.references :insumo, null: false, foreign_key: true

      t.timestamps
    end
  end
end
