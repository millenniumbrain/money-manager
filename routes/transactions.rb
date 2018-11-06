App.route("transactions") do |r|
  response['Content-Type'] = 'application/json'
  r.is do
    r.get do
      transaction = Transaction.all
      transaction.to_a.map! { |a| a.to_hash }
      transaction.each do |t|
        t[:amount] = "%.2f" % t[:amount].to_s 
        t[:date] = t[:date].strftime("%b %d, %Y")
        t[:account_name] = Account[t[:account_id]].name
      end
      transaction.to_json
    end

    r.post do
      transaction = r.params
      new_transaction = Transaction.new do |t|
        t.date = DateTime.strptime(transaction["date"], "%b %d, %Y")
        t.type = transaction["type"]
        t.amount = BigDecimal.new(transaction["amount"]);
        t.account_id = transaction["account"]
      end
      type = transaction["type"]
      if ((type !~ /^\s*$/) != nil && type == "income")
        new_transaction.desc = "Money deposited to the acccount"
      elsif ((type !~ /^\s*$/) != nil && type == "expense")
        new_transaction.desc = "General expense"
      else
        new_transaction.desc = transaction["desc"]
      end
      new_transaction.save
      ""
    end
  end

  r.multi_route('transactions')
end
