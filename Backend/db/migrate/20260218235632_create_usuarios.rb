class CreateUsuarios < ActiveRecord::Migration[8.1]
  def change
    create_table :usuarios do |t|
      t.string :nome
      t.string :usuario
      t.string :senha
      t.string :email
      t.boolean :operador
      t.boolean :recomendate
      t.boolean :ativo, default: true 

      t.timestamps
    end
  end
end
