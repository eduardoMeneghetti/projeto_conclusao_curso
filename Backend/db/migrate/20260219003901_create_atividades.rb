class CreateAtividades < ActiveRecord::Migration[8.1]
  def change
    create_table :atividades do |t|
      t.string :descricao
      t.string :cor
      t.boolean :ativo

      t.timestamps
    end
  end
end
