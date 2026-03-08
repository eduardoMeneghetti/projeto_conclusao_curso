class CreatePropriedades < ActiveRecord::Migration[8.1]
  def change
    create_table :propriedades do |t|
      t.string :descricao
      t.decimal :hectare, precision: 10, scale: 2
      t.references :cidade, null: false, foreign_key: true

      t.timestamps
    end
  end
end
