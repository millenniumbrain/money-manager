class PaymentStatus < Sequel::Model(:payment_statuses)
  many_to_one :user
end