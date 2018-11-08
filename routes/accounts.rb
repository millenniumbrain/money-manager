App.route("accounts") do |r|
  #@token = if Locker.decode_token(token: session[:login]) then Locker.decode_token(token: session[:login]).first else false end
  response['Content-Type'] = 'application/json'
  r.is do
    r.get do
      account = Account.all
      account.to_a.map! { |a| a.to_hash }
      account.to_json
    end

    r.post do
      account = r.params
      account = Account.new(name: account["account_name"])
      account.save
      ""
    end
  end

  r.on Integer do |id|
    @account = Account[id]
    transactions = Transaction
    .where(account_id: id).inject(0) do |sum, r|
      value = r[:amount]
      if r[:type] == "income"
        sum + value
      else
        sum - value
      end
    end
    {
      balance: {
        current: "%.2f" % transactions,
        available: "%.2f" % transactions
      }
    }.to_json
  end

  r.multi_route('accounts')
end
