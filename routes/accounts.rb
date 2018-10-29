App.route("accounts") do |r|
  #@token = if Locker.decode_token(token: session[:login]) then Locker.decode_token(token: session[:login]).first else false end

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

  r.is 'balance' do
  
  end

  r.multi_route('accounts')
end
