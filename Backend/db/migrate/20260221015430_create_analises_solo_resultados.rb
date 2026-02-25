class CreateAnalisesSoloResultados < ActiveRecord::Migration[8.1]
  def change
    create_table :analises_solo_resultados do |t|
      t.references :analises_solo, null: false, foreign_key: true
      t.string :parametro_medido
      t.integer :parametro_medido_id
      t.decimal :valor, precision: 10, scale: 2

      t.timestamps
    end
  end
end
