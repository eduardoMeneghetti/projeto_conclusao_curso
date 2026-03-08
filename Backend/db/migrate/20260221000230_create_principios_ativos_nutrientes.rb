class CreatePrincipiosAtivosNutrientes < ActiveRecord::Migration[8.1]
  def change
    create_table :principios_ativos_nutrientes do |t|
      t.references :principios_ativo, null: false, foreign_key: true
      t.references :nutriente, null: false, foreign_key: true
      t.decimal :percentual, precision: 5, scale: 2

      t.timestamps
    end
  end
end
