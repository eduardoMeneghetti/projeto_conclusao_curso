class AddSiglaToUnidadesMedidas < ActiveRecord::Migration[8.1]
  def change
    add_column :unidades_medidas, :sigla, :string
  end
end
