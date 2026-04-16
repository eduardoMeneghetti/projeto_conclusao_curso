class AddAtivoToUnidadesMedidas < ActiveRecord::Migration[8.1]
  def change
    add_column :unidades_medidas, :ativo, :boolean, default: true, null: false
  end
end
