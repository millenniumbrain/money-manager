App.route("transactions") do |r|
  response['Content-Type'] = 'application/json'
  r.is do
    r.get do
      query_params ||= parse_nested_query(r.query_string)
      transaction = nil
      #pp query_params
      case "true"
      when query_params['monthly']
        monthly_income = Transaction.select(:amount, :date).where(type: 'income')
          .select_group(Sequel.function(:strftime, '%Y-%m', :date).as(:year))
          .select_append(Sequel.function(:round, 
            Sequel.function(:sum, :amount), 2).as(:income)
          ) # can't round and sum for some reason investigate furhter later
          .each_with_object({}) do |item, hash|
            hash[item[:year]] = item[:income].round(2)
          end
        monthly_expenses = Transaction.select(:amount, :date).where(:type => 'expense')
        .select_group(Sequel.function(:strftime, '%Y-%m', :date).as(:year))
        .select_append(Sequel.function(:round, 
          Sequel.function(:sum, :amount),2).as(:expense)
        )
        .each_with_object({}) do |item, hash|
          hash[item[:year]] = item[:expense]
        end
        transaction = {
          income: monthly_income,
          expenses: monthly_expenses,
          totals: monthly_income.merge(monthly_expenses){|k, i, e| (i - e).round(2)}
        }
      when query_params["current_month"]
        transaction = Transaction.where{Sequel.lit("STRFTIME('%m', date) = STRFTIME('%m', date('now'))") & Sequel.lit("STRFTIME('%Y', date) = STRFTIME('%Y', date('now'))")}.limit(10)
        transaction = transaction.to_a.map! { |a| a.to_hash }
        transaction.each do |t|
          t[:amount] = format_currency(t[:amount]) 
          t[:date] = t[:date].strftime("%b %d, %Y")
          t[:account_name] = Account[t[:account_id]].name
        end
      else
        transaction = Transaction.limit(10)
        transaction = transaction.to_a.map! { |a| a.to_hash }
        transaction.each do |t|
          t[:amount] = format_currency(t[:amount]) 
          t[:date] = t[:date].strftime("%b %d, %Y")
          t[:account_name] = Account[t[:account_id]].name
        end
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
