App.route('budgets', 'dashboard') do |r|
  r.is do
    r.get do
      view('dashboard/budgets', layout: 'dashboard/layout', layout_opts: {
          locals: {
            title: "Bills", 
            add_item: {id: "addAccount", text: "Add Account"},
            js: [link_js("dashboard")]
          }
        })
    end
  end
  r.multi_route("budgets")
end
