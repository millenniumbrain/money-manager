class Transaction < Sequel::Model(:transactions)
  many_to_one :user
  many_to_one :account
  many_to_one :bill
  many_to_one :category

  def self.calc_totals(num_months, income, expenses, larger_type)
    if larger_type == "income"
      mon_income = income.nil? ? 0.0 : income[:income]
      mon_expense = expenses.nil? ? 0.0 : expenses[:expense]
      amount = mon_income - mon_expense
      {month: income[:month], amount: amount.round(2)}
    else
      mon_income = income.nil? ? 0.0 : income[:income]
      mon_expense = expenses.nil? ? 0.0 : expenses[:expense]
      amount = mon_income - mon_expense
      {month: expenses[:month], amount: amount.round(2)}
    end
  end

  def self.monthly_totals
    income = select(:amount, :date).where(type: 'income')
      .select_group(Sequel.function(:strftime, '%Y-%m', :date).as(:month))
      .select_append(Sequel.function(:round, 
        Sequel.function(:sum, :amount), 2).as(:income)).to_a.map! {|a| a.to_hash}
    expenses = select(:amount, :date).where(:type => 'expense')
      .select_group(Sequel.function(:strftime, '%Y-%m', :date).as(:month))
      .select_append(Sequel.function(:round, 
        Sequel.function(:sum, :amount),2
      ).as(:expense)).to_a.map! {|a| a.to_hash}

    num_months = 0
    totals = []
    if income.length > expenses.length
      num_months = income.length
      while i < num_months do
        totals.push(calc_totals(num_months, income[i], expenses[i], "income"))
        i += 1
      end
    elsif expenses.length > income.length
      num_months = expenses.length
      i = 0
      while i < num_months do
        totals.push(calc_totals(num_months, income[i], expenses[i], "expenses"))
        i += 1
      end
    else
      num_months = income.length
      i = 0
      while i < num_months do
        totals.push(calc_totals(num_months, income[i], expenses[i], "income"))
        i += 1
      end
    end


    totals
  end

  def self.monthly_total_types
    income = select(:amount, :date).where(type: 'income')
      .select_group(Sequel.function(:strftime, '%Y-%m', :date).as(:month))
      .select_append(Sequel.function(:round, 
        Sequel.function(:sum, :amount), 2).as(:income)).to_a.map! {|a| a.to_hash}
    expenses = Transaction.select(:amount, :date).where(:type => 'expense')
      .select_group(Sequel.function(:strftime, '%Y-%m', :date).as(:month))
      .select_append(Sequel.function(:round, 
        Sequel.function(:sum, :amount),2
      ).as(:expense)).to_a.map! {|a| a.to_hash}
    
    num_months = 0
    if income.length > expenses.length
      num_months = income.length
    elsif expenses.length > income.length
      num_months = expenses.length
    else
      num_months = income.length
    end

    i = 0
    amounts = []
    while i < num_months do
      mon_income = income[i].nil? ? 0.0 : income[i][:income]
      mon_expense = expenses[i].nil? ? 0.0 : expenses[i][:expense]
      amount = mon_income - mon_expense
      if income[i].nil?
        amounts.push({month: expenses[i][:month], income: mon_income, expense: mon_expense})
      else
        amounts.push({month:  income[i][:month], income: mon_income, expense: mon_expense})
      end
      i += 1
    end
    amounts
  end

  def self.from_current_month
    transactions = select(:date, :type, :amount, :desc).where{
      Sequel.lit("STRFTIME('%m', date) = STRFTIME('%m', date('now'))") & Sequel.lit("STRFTIME('%Y', date) = STRFTIME('%Y', date('now'))")
    }.join(:accounts, id: :account_id)
    .join(:categories, id: Sequel.lit("transactions.category_id"))
    .select_append(Sequel.lit("categories.name").as(:category_name))
    .select_append(Sequel.lit("accounts.name AS account_name"))
    .limit(10)
    transaction = transaction.to_a.map! { |a| a.to_hash }
    transaction.each do |t|
      t[:amount] = format_currency(t[:amount]) 
      t[:date] = t[:date].strftime("%b %d, %Y")
      t[:account_name] = Account[t[:account_id]].name
      t[:category_name] = Category[t[:category_id]].name
    end
    transactions
  end

  def self.list_recent
    transactions = select(:date, :type, :amount, :desc).join(:accounts, id: :account_id)
    .join(:categories, id: Sequel.lit("transactions.category_id"))
    .select_append(Sequel.lit("categories.name").as(:category_name))
    .select_append(Sequel.lit("accounts.name").as(:account_name)).limit(10).to_a.map! { |a| a.to_hash }
    transactions.each do |t|
      t[:amount] = format_currency(t[:amount]) 
      t[:date] = t[:date].strftime("%b %d, %Y")
    end
    transactions
  end
end