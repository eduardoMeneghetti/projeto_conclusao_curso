class CreateSafras < ActiveRecord::Migration[8.1]
  def change
    create_table :safras do |t|
      t.string :descricao
      t.date :data_inicio
      t.date :data_final
      t.boolean :ativo

      t.timestamps
    end
  end
end
