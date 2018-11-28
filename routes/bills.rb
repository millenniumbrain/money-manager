App.route("bills") do |r|
  response['Content-Type'] = 'application/json'

  r.is do
    r.get do
      query_params ||= parse_nested_query(r.query_string)
      bills = {}
      case "true"
      when query_params["show_upcoming"]
        pp "She's the man"
        bills = Bill.where{
          Sequel.lit("STRFTIME('%m', due_date) = STRFTIME('%m', date('now'))") & 
          Sequel.lit("STRFTIME('%Y', due_date) = STRFTIME('%Y', date('now'))")
        }
        bills = bills.to_a.map! {|a| a.to_hash }
      when["current_month"]
      else
        bills = Bill.limit(10)
        bills = bills.to_a.map! {|a| a.to_hash }
        bills.each do |b|
          b[:payment_status_id] = PaymentStatus[b[:payment_status_id]].name
          b[:due_date] = b[:due_date].strftime("%b %d, %Y")
          if b[:service_provider_id].nil?
            b[:service_provider_id] = "None"
          else
            b[:service_provider_id] = ServiceProvider[b[:service_provider_id]]
          end
        end
      end
      
      bills.to_json
    end

    r.post do
      bill = r.params
      payment_status = nil
      if bill["amount_owed"].to_f > bill["amount_paid"].to_f
        payment_status = PaymentStatus[1]
      else
        payment_status = PaymentStatus[2]
      end
      new_bill = Bill.new do |b|
        b.due_date = DateTime.strptime(bill["due_date"], "%b %d, %Y")
        b.amount_owed = bill["amount_owed"]
        b.amount_paid = bill["amount_paid"]
        b.notes = bill["notes"]
        b.payment_status_id = payment_status.id
      end
      new_bill.save
      ""
    end
  end

  r.is 'payment-status' do
    r.get do
    end
  end

  r.is 'quantity' do
    r.get do
      num_bills = Bill.count
      not_paid_bills = Bill.where(payment_status_id: 1).count
      paid_bills = Bill.where(payment_status_id: 2).count
      {
        quantity: {
          total: num_bills,
          paid: paid_bills,
          not_paid: not_paid_bills
        }
      }.to_json
    end
  end
end