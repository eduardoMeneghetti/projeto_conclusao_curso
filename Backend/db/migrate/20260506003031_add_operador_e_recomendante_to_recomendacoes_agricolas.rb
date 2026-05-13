class AddOperadorERecomendanteToRecomendacoesAgricolas < ActiveRecord::Migration[8.1]
  def change
    add_reference :recomendacoes_agricolas, :operador, null: false, foreign_key: {to_table: :usuarios}
    add_reference :recomendacoes_agricolas, :recomendante, null: false, foreign_key: {to_table: :usuarios}
  end
end
