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
visit('http://127.0.0.1:9292/dashboard')
page.find("#addTransaction").click
page.has_select?('form select', options: ['My Account'])
types = find("form select[name=type]").all('option').collect(&:text)
pp types
find('form select[name=type]').find("option[value=#{types[rand(1)]}]").select_option
fill_in 'desc', with: Faker::Commerce.department(5)
page.save_screenshot('screenshot.png')