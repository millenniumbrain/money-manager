require 'bundler/setup'
ENV["BUNDLE_GEMFILE"] = "/home/wwilson/money-manager/Gemfile"
require 'capybara'
require 'capybara/dsl'
require 'selenium-webdriver'
require Dir.home + '/money-manager/app.rb'
pp ENV
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
Capybara.default_driver = :selenium #:headless_firefox
include Capybara::DSL
page.driver.browser.manage.window.resize_to(1600, 900)
visit('http://127.0.0.1:9292/dashboard')
sleep(20)
page.find("#addTransaction").click
page.has_select?('form select', options: ['My Account'])
page.save_screenshot('screenshot.png')