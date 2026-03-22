class AddServerIdToUsuarios < ActiveRecord::Migration[8.1]
  def change
    add_column :usuarios, :server_id, :integer
  end
end
