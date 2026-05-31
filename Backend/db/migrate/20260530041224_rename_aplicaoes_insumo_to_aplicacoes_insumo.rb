class RenameAplicaoesInsumoToAplicacoesInsumo < ActiveRecord::Migration[8.1]
  def change
     rename_table :aplicaoes_insumo, :aplicacoes_insumo
  end
end
