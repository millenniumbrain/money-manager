def format_currency(num)
  amount = "%.2f" % num
  amount.gsub(/(\d)(?=(\d{3})+$)/, '\\1,')
end