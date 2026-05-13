class RemoveSafraIdFromRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    remove_column :recomendacoes_agricolas, :safra_id, :string
  end
end
