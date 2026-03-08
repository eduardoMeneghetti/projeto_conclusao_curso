class CreateCidades < ActiveRecord::Migration[8.1]
  def change
    create_table :cidades do |t|
      t.string :descricao
      t.integer :codigo_ibge
      t.decimal :latitude, precision: 10, scale: 6
      t.decimal :longitude, precision: 10, scale: 6
      t.references :estado, null: false, foreign_key: true

      t.timestamps
    end
  end
end
