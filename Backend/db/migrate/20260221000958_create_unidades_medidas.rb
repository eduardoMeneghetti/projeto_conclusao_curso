class CreateUnidadesMedidas < ActiveRecord::Migration[8.1]
  def change
    create_table :unidades_medidas do |t|
      t.string :descrcicao

      t.timestamps
    end
  end
end
