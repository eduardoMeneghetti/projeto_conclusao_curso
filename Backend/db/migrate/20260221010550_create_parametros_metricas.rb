class CreateParametrosMetricas < ActiveRecord::Migration[8.1]
  def change
    create_table :parametros_metricas do |t|
      t.string :tipo, limit: 1
      t.string :descricao

      t.timestamps
    end
  end
end
