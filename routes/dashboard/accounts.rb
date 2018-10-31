App.route('accounts', 'dashboard') do |r|
  r.is do
    r.get do
      view('dashboard/accounts', layout: 'dashboard/layout', layout_opts: {
          locals: {
            title: "Accounts", 
            add_item: {id: "addAccount", text: "Add Account"},
            js: [link_js("dashboard")]
          }
        })
    end
  end
  r.multi_route("accounts")
end
