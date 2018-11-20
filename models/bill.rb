class Bill < Sequel::Model(:bills)
  many_to_one :user
  one_to_many :transactions
  many_to_one :service_provider
end