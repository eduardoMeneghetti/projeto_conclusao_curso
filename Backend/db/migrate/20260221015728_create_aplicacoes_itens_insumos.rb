class CreateAplicacoesItensInsumos < ActiveRecord::Migration[8.1]
  def change
    create_table :aplicacoes_itens_insumos do |t|
      t.references :aplicaoes_insumo, null: false, foreign_key: { to_table: :aplicaoes_insumos }
      t.references :principios_ativo, null: false, foreign_key: true
      t.references :insumo, null: false, foreign_key: true
      t.decimal :quantidade_aplic, precision: 10, scale: 2
      t.decimal :dose_aplic, precision: 10, scale: 2

      t.timestamps
    end
  end
end
