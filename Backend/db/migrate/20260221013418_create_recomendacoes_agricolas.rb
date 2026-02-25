class CreateRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    create_table :recomendacoes_agricolas do |t|
      t.references :safra, null: false, foreign_key: true
      t.references :atividade, null: false, foreign_key: true
      t.references :analises_solo, null: true, foreign_key: true
      t.references :propriedade, null: false, foreign_key: true
      t.references :atividade_gleba, null: false, foreign_key: true
      t.references :atividade_safra, null: false, foreign_key: true
      t.datetime :data_recomendacao
      t.string :recomendante
      t.string :operador
      t.boolean :ativo, default: true 

      t.timestamps
    end
  end
end
