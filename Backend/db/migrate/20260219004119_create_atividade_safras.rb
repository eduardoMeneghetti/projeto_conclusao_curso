class CreateAtividadeSafras < ActiveRecord::Migration[8.1]
  def change
    create_table :atividade_safras do |t|
      t.references :atividade, null: false, foreign_key: true
      t.references :safra, null: false, foreign_key: true
      t.references :propriedade, null: false, foreign_key: true

      t.timestamps
    end
  end
end
