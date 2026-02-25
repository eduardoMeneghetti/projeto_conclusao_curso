class CreateGlebas < ActiveRecord::Migration[8.1]
  def change
    create_table :glebas do |t|
      t.string :descricao
      t.boolean :ativo
      t.decimal :area_hectares, precision: 10, scale: 2
      t.references :propriedade, null: false, foreign_key: true

      t.timestamps
    end
  end
end
