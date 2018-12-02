require 'sequel'
require 'logger'
require 'faker'
namespace :sqlite do
  task :new do
    file = File.new 'db/test.sqlite', 'w+'
    file.close
  end

  desc 'runs database migrations'
  task :migrate do
    system('mkdir -p db')
    DB = Sequel.sqlite('db/test.sqlite')
    DB.loggers << Logger.new($stdout)
    Sequel.extension :migration
    Sequel::Migrator.apply(DB, 'migrations')
  end

  task :setup do
    DB = Sequel.sqlite(File.dirname(__FILE__)+'/db/test.sqlite')
    DB.loggers << Logger.new($stdout)
    Sequel.default_timezone = :utc
    Sequel.datetime_class = DateTime
    Sequel::Model.plugin :timestamps, :update_on_create => true
    Dir[File.dirname(__FILE__) + '/models/*.rb'].each { |f| require f}
    
    ServiceProvider.insert(name: "None")
    PaymentStatus.insert(name: "Not Paid")
    PaymentStatus.insert(name: "Paid")

    Category.insert(name: "Food")
    Category.insert(name: "Shopping")
    Category.insert(name: "Tech")
    Category.insert(name: "Other")
  end
end
