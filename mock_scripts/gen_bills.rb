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
visit("#{ENV['BASE_URL']}/dashboard/bills")
puts "Adding a Bill"
page.find("#addBill").click
page.has_selector?('form input[name="due_date"]')
i = 0
puts "Adding info"
while i < 10 do

  fill_in 'due_date', with: Faker::Date.between(Date.today.months_ago(6), Date.today).strftime("%b %d, %Y")
  fill_in 'notes', with: Faker::Commerce.department(5)
  amount = Faker::Number.decimal(rand(1..2), 2)
  fill_in 'amount_owed', with: amount
  fill_in 'amount_paid', with: 0.00

  puts "Submiting Bill"
  system('mkdir -p screenshots')
  system('mkdir -p screenshots/bills')
  page.save_screenshot("screenshots/bills/screenshot#{i}.png")
  find('#newBill button').click
  i+=1
end
puts "All done"