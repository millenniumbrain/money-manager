Sequel.migration do
  up do
    create_table(:bills) do
      primary_key :id
      String :name
      DateTime :due_date
      BigDecimal :amount_owed
      BigDecimal :amount_paid
      String :notes
      String :pay_period_type
      String :file_path
      DateTime :created_at
      DateTime :updated_at
      foreign_key :payment_status_id
      foreign_key :user_id
    end
  end

  down do
    drop_table(:users)
  end
end