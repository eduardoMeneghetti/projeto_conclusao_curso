class AddDeletedAtInAplicacoesInsumos < ActiveRecord::Migration[8.1]
  def change
    add_column :aplicacoes_insumos, :deleted_at, :datetime
  end
end
