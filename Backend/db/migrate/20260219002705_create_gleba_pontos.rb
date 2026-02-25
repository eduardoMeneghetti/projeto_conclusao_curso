class CreateGlebaPontos < ActiveRecord::Migration[8.1]
  def change
    create_table :gleba_pontos do |t|
      t.decimal :latitude, precision: 10, scale: 6
      t.decimal :longitude, precision: 10, scale: 6
      t.integer :ordem
      t.references :gleba, null: false, foreign_key: true

      t.timestamps
    end
  end
end
