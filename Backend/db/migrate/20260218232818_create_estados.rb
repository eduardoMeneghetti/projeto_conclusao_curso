class CreateEstados < ActiveRecord::Migration[8.1]
  def change
    create_table :estados do |t|
      t.string :descricao
      t.integer :codigo_ibge
      t.string :sigla

      t.timestamps
    end
  end
end
