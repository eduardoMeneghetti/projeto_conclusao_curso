class AddAreaAplicStatusToRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    add_column :recomendacoes_agricolas, :area_aplic, :decimal, precision: 10, scale: 2
    add_column :recomendacoes_agricolas, :status, :string
  end
end
