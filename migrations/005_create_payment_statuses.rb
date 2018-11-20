Sequel.migration do
  up do
    create_table(:payment_statuses) do
      primary_key :id
      String :name
      foreign_key :user_id
    end
  end

  down do
    drop_table(:users)
  end
end