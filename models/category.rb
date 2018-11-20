class Category < Sequel::Model(:categories)
  many_to_one :user
  one_to_many :transactions
end