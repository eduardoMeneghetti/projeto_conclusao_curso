class AddDeletedAtInPrincipioAtivosNutrientes < ActiveRecord::Migration[8.1]
  def change
    add_column :principios_ativos_nutrientes, :deleted_at, :datetime
  end
end
