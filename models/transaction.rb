class Transaction < Sequel::Model(:transactions)
  many_to_one :user
  many_to_one :account
end