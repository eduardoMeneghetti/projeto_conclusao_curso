class CreateAplicaoesInsumos < ActiveRecord::Migration[8.1]
  def change
    create_table :aplicaoes_insumos do |t|
      t.references :propriedade, null: false, foreign_key: true
      t.references :atividade, null: false, foreign_key: true
      t.references :atividade_safra, null: false, foreign_key: true
      t.references :atividade_gleba, null: false, foreign_key: true
      t.references :usuario, null: false, foreign_key: true
      t.references :maquina, null: false, foreign_key: true
      t.string :operador
      t.references :recomendacoes_agricolas, null: true, foreign_key: true
      t.decimal :area_aplic, precision: 10, scale: 2
      t.datetime :data_inicio
      t.datetime :data_final
      t.boolean :ativo, default: true 

      t.timestamps
    end
  end
end
