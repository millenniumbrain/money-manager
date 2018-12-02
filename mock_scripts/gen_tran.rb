require 'bundler/setup'
ENV["BUNDLE_GEMFILE"] = "/home/wwilson/money-manager/Gemfile"
require 'capybara'
require 'capybara/dsl'
require 'selenium-webdriver'
require 'faker'
require Dir.home + '/money-manager/app.rb'
App.environment = :headless
Capybara.app = App

Capybara.server = :puma
Capybara.server_port = 9292
Capybara.register_driver :headless_firefox do |app|
  browser_options = Selenium::WebDriver::Firefox::Options.new()
  browser_options.args << '--headless'

Capybara::Selenium::Driver.new(
    app,
    browser: :firefox,
    options: browser_options
  )
end

Capybara.default_driver = :headless_firefox
include Capybara::DSL
page.driver.browser.manage.window.resize_to(1600, 900)
puts "Visiting page..."
visit("#{ENV['BASE_URL']}/dashboard")
puts "Adding a transaction"
page.find("#addTransaction").click
page.has_select?('form select', options: ['My Account'])
i = 0
puts "Adding info"
while i < 10 do
  num_types = find('form select[name=type]').all('option').collect(&:text)
  num_accounts = find('form select[name=account]').all('option').collect(&:text)
  num_cats = find('form select[name=category]').all('option').collect(&:text)

  num_types = rand(1..num_types.length)
  num_accounts = rand(1..num_accounts.length)
  num_cats = rand(1.. num_cats.length)

  find('form select[name=type]').find(:xpath, "option[#{num_types}]").select_option
  find('form select[name=account]').find(:xpath, "option[#{num_accounts}]").select_option
  find('form select[name=category]').find(:xpath, "option[#{num_cats}]").select_option
  fill_in 'date', with: Faker::Date.between(Date.today.months_ago(6), Date.today).strftime("%b %d, %Y")
  fill_in 'desc', with: Faker::Commerce.department(5)
  fill_in 'amount', with: Faker::Number.decimal(rand(1..2), 2)
  puts "Submiting transaction"
  system('mkdir -p screenshots')
  page.save_screenshot("screenshots/screenshot#{i}.png")
  find('#newTransaction button').click
  i+=1
end
puts "All done"
