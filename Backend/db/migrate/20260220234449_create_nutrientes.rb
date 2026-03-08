class CreateNutrientes < ActiveRecord::Migration[8.1]
  def change
    create_table :nutrientes do |t|
      t.string :descricao
      t.string :sigla
      t.string :unidade

      t.timestamps
    end
  end
end
