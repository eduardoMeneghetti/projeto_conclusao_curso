class AddDeletedAtInGlebas < ActiveRecord::Migration[8.1]
  def change
    add_column :glebas, :deleted_at, :datetime
  end
end
