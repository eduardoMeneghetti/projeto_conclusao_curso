class AddDeletedAtInAplicacoesItensInsumos < ActiveRecord::Migration[8.1]
  def change
    add_column :aplicacoes_itens_insumos, :deleted_at, :datetime
  end
end
