class RemoveRecomendanteOperadorFromRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    remove_column :recomendacoes_agricolas, :recomendante, :string
    remove_column :recomendacoes_agricolas, :operador, :string
  end
end
