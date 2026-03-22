class AddAtivoToPropriedades < ActiveRecord::Migration[8.1]
  def change
    add_column :propriedades, :ativo, :boolean, default: true, null: false
  end
end
