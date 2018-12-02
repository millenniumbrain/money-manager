App.route("transactions") do |r|
  response['Content-Type'] = 'application/json'
  r.is do
    r.get do
      query_params ||= parse_nested_query(r.query_string)
      transactions = {}
      case "true"
      when query_params['monthly']
        transactions = {
          monthly_total_types: Transaction.monthly_total_types,
          monthly_totals: Transaction.monthly_totals
        }
      when query_params["current_month"]
        transaction = Transaction.from_current_month
      else
        transactions = Transaction.list_recent
      end
      transactions.to_json
    end

    r.post do
      transaction = r.params
      new_transaction = Transaction.new do |t|
        t.date = DateTime.strptime(transaction["date"], "%b %d, %Y")
        t.type = transaction["type"]
        t.amount = BigDecimal.new(transaction["amount"]);
        t.account_id = transaction["account"]
        t.category_id = transaction["category"]
      end
      type = transaction["type"]
      if ((type =~ /^\s*$/) != nil && type == "income")
        new_transaction.desc = "Money deposited to the acccount"
      elsif ((type =~ /^\s*$/) != nil && type == "expense")
        new_transaction.desc = "General expense"
      else
        new_transaction.desc = transaction["desc"]
      end
      new_transaction.save
      ""
    end
  end


  r.is "categories" do
    cats = Transaction.group_and_count(:category_id)
      .join(:categories, id: :category_id)
      .select_append(Sequel.lit("categories.name as category_name"))
      .to_a.map!{ |a| a.to_hash }
    cats.to_json
  end

  r.multi_route('transactions')
end
