class CreateFichamentos < ActiveRecord::Migration[8.1]
  def change
    create_table :fichamentos do |t|
      t.references :parametros_metrica, null: false, foreign_key: true
      t.string :classificacao
      t.decimal :valor_min, precision: 6, scale: 2
      t.decimal :valor_max, precision: 6, scale: 2

      t.timestamps
    end
  end
end
