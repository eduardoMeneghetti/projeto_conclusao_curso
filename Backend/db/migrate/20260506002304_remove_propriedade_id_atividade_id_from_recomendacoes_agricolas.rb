class RemovePropriedadeIdAtividadeIdFromRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    remove_column :recomendacoes_agricolas, :propriedade_id, :string
    remove_column :recomendacoes_agricolas, :atividade_id, :string
  end
end
