class CreateAjusteEstoques < ActiveRecord::Migration[8.1]
  def change
    create_table :ajuste_estoques do |t|
      t.references :usuario, null: false, foreign_key: true
      t.references :propriedade, null: false, foreign_key: true
      t.string :observacao
      t.date :data
      t.string :entrada_saida, limit: 1

      t.timestamps
    end
  end
end
