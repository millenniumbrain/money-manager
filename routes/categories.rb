App.route("categories") do |r|
  #@token = if Locker.decode_token(token: session[:login]) then Locker.decode_token(token: session[:login]).first else false end
  response['Content-Type'] = 'application/json'
  r.is do
    r.get do
      categories = Category.limit(10)
      categories = categories.to_a.map! { |a| a.to_hash }
      categories.to_json
    end

    r.post do

    end
  end

  r.multi_route('accounts')
end
