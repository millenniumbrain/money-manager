App.route("dashboard") do |r|
  #@token = if Locker.decode_token(token: session[:login]) then Locker.decode_token(token: session[:login]).first else false end
  r.is do
    r.get do
      view('dashboard/home', layout: 'dashboard/layout',
          layout_opts: { locals: {title: "Home", js: ["../js/dashboard.js"]}})
    end

    r.post do
    end
  end

  r.multi_route('dashboard')
end
