class AddDeletedAtInAjusteEstoques < ActiveRecord::Migration[8.1]
  def change
    add_column :ajuste_estoques, :deleted_at, :datetime
  end
end
