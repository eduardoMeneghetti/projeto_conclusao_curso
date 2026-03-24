class RenameRecomendanteInUsuarios < ActiveRecord::Migration[8.1]
  def change
    rename_column :usuarios, :recomendate, :recomendante
  end
end
