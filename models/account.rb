class Account < Sequel::Model(:accounts)
  many_to_one :user
  one_to_many :transactions
end