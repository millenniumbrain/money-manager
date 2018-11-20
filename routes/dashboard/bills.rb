App.route('bills', 'dashboard') do |r|
  r.is do
    r.get do
      view('dashboard/bills', layout: 'dashboard/layout', layout_opts: {
          locals: {
            title: "Bills", 
            add_item: {id: "addBill", text: "Add Bill"},
            js: [link_js("bills")]
          }
        })
    end
  end
  r.multi_route("bills")
end
