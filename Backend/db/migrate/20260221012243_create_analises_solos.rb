class CreateAnalisesSolos < ActiveRecord::Migration[8.1]
  def change
    create_table :analises_solos do |t|
      t.references :propriedade, null: false, foreign_key: true
      t.references :safra, null: false, foreign_key: true
      t.references :atividade, null: false, foreign_key: true
      t.references :atividade_gleba, null: false, foreign_key: true
      t.references :atividade_safra, null: false, foreign_key: true
      t.datetime :data_coleta
      t.boolean :ativo, default: true 

      t.timestamps
    end
  end
end
