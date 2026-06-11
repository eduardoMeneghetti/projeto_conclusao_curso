class AddDeletedAtInRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    add_column :recomendacoes_agricolas, :deleted_at, :datetime
  end
end
