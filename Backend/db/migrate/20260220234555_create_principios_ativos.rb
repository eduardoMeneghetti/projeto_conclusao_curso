class CreatePrincipiosAtivos < ActiveRecord::Migration[8.1]
  def change
    create_table :principios_ativos do |t|
      t.string :descricao
      t.boolean :ativo

      t.timestamps
    end
  end
end
