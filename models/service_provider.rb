class ServiceProvider < Sequel::Model(:service_providers)
  many_to_one :user
  one_to_many :transactions
  one_to_many :bills
end