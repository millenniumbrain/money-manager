Sequel.migration do
  up do
    create_table(:categories) do
      primary_key :id
      String :name
      DateTime :created_at
      DateTime :updated_at
      foreign_key :user_id
    end
  end

  down do
    drop_table(:users)
  end
end