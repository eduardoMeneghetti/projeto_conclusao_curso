class AddDeletedAtInRecomendacoesAgricolasItens < ActiveRecord::Migration[8.1]
  def change
    add_column :recomendacoes_agricolas_itens, :deleted_at, :datetime
  end
end
