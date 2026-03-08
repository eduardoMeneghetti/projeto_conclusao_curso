class CreateAtividadeGlebas < ActiveRecord::Migration[8.1]
  def change
    create_table :atividade_glebas do |t|
      t.references :gleba, null: false, foreign_key: true
      t.references :atividade_safra, null: false, foreign_key: true

      t.timestamps
    end
  end
end
