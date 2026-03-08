class CreateInsumos < ActiveRecord::Migration[8.1]
  def change
    create_table :insumos do |t|
      t.string :descricao
      t.boolean :semente
      t.boolean :ativo
      t.references :unidades_medida, null: false, foreign_key: true
      t.references :principios_ativos, null: false, foreign_key: true

      t.timestamps
    end
  end
end
