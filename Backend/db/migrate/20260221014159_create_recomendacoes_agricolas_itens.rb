class CreateRecomendacoesAgricolasItens < ActiveRecord::Migration[8.1]
  def change
    create_table :recomendacoes_agricolas_itens do |t|
      t.references :recomendacao_agricola, null: false, foreign_key: { to_table: :recomendacoes_agricolas }
      t.references :principios_ativo, null: false, foreign_key: true
      t.references :insumo, null: false, foreign_key: true
      t.decimal :dose, precision: 10, scale: 2
      t.decimal :quantidade, precision: 10, scale: 2

      t.timestamps
    end
  end
end
