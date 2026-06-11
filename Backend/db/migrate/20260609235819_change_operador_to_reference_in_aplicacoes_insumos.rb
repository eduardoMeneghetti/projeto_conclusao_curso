class ChangeOperadorToReferenceInAplicacoesInsumos < ActiveRecord::Migration[8.1]
  def change
  remove_column :aplicacoes_insumos, :operador, :string
  add_reference :aplicacoes_insumos, :operador, foreign_key: { to_table: :usuarios }, null: false
  end
end
