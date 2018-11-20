Sequel.migration do
  up do
    create_table(:transactions) do
      primary_key :id
      DateTime :date
      String :type
      BigDecimal :amount
      String :desc
      DateTime :created_at
      DateTime :updated_at
      foreign_key :user_id
      foreign_key :bill_id
      foreign_key :category_id
      foreign_key :account_id
    end
  end

  down do
    drop_table(:users)
  end
end
