App.route("bills") do |r|
  response['Content-Type'] = 'application/json'

  r.is do
    r.get do
      query_params ||= parse_nested_query(r.query_string)
      bills = {}
      case "true"
      when query_params["show_upcoming"]
        bills = Bill.where{
          Sequel.lit("STRFTIME('%m', due_date) = STRFTIME('%m', date('now'))") & 
          Sequel.lit("STRFTIME('%Y', due_date) = STRFTIME('%Y', date('now'))")
        }
        bills = bills.to_a.map! {|a| a.to_hash }
      when query_params["current_month"]
      when query_params["quantity"]
        bills = Bill.all.count
        bills = {quantity: bills}
      else
        bills = Bill
        .select(:due_date, :amount_owed, :amount_paid, :notes)
        .join(:service_providers, id: :service_provider_id)
        .join(:payment_statuses, id: Sequel.lit("bills.payment_status_id"))
        .select_append(Sequel.lit("service_providers.name AS service_provider"))
        .select_append(Sequel.lit("payment_statuses.name AS payment_status"))
        .limit(10)
        bills = bills.to_a.map! {|a| a.to_hash }
        bills.each do |b|
          b[:due_date] = b[:due_date].strftime("%b %d, %Y")
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
        b.service_provider_id = 1
        b.payment_status_id = payment_status.id
      end
      new_bill.save
      ""
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

  r.is "upcoming" do
    r.get do
      upcoming_bills = {}
      upcoming_bills = Bill
      .select(:due_date, :amount_owed, :amount_paid, :notes)
      .join(:service_providers, id: :service_provider_id)
      .join(:payment_statuses, id: Sequel.lit("bills.payment_status_id"))
      .where{Sequel.function(:datetime, 'now') < Sequel.function(:datetime, :due_date) }
      .select_append(Sequel.lit("service_providers.name AS service_provider"))
      .select_append(Sequel.lit("payment_statuses.name AS payment_status"))
      .order(Sequel.desc(:due_date))
      .limit(10)
      .to_a.map! {|a| a.to_hash}
      upcoming_bills.to_json
    end
  end
end