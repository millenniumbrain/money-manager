require 'puma'
require 'roda'
require 'pp'
require 'json'
require 'logger'
require 'rbnacl'
require 'securerandom'
require 'base64'
require 'active_support'
require 'active_support/core_ext/date_time'
require 'active_support/core_ext/date'
require 'active_support/core_ext/time'
require 'active_support/core_ext/numeric'
require 'nokogiri'
require 'jwt'
require 'tilt/erubis'
require_relative './models'
require_relative './.env.rb'

class App < Roda
  plugin :default_headers,
    'Content-Type' => 'text/html',
    'Content-Security-Policy' => "default-src 'self' #{ENV['BASE_URL']} *.cloudflare.com *.fontawesome.com *.googleapis.com *.gstatic.com unpkg.com; style-src 'self' 'unsafe-inline' *.fontawesome.com *.googleapis.com *.gstatic.com unpkg.com #{ENV['BASE_URL']}; img-src *",
    'Strict-Transport-Security' => 'max-age=160704400',
    'X-Frame-Options' => 'deny',
    'X-Content-Type-Options' => 'nosniff',
    'X-XSS-Protection' => '1; mode=block'
  plugin :environments
  plugin :multi_route
  plugin :render, :engine => 'erubis', :views => File.dirname(__FILE__) + '/views'
  plugin :static, ['/js', '/css'], root: File.dirname(__FILE__) + '/public'
  plugin :flash
  plugin :all_verbs
  plugin :h
  plugin :multi_route
  plugin :not_found do
    Nokogiri::HTML(File.open(File.dirname(__FILE__) + "/public/404.html")).to_s
  end

  self.environment = :development

  configure do
    use Rack::Session::Cookie, :secret => ENV['SECRET']
    use Rack::Session::Pool, :expire_after => 252000
  end

  configure :development do
    use Rack::MethodOverride
  end

  configure :production do
  end


  Dir[File.dirname(__FILE__) + '/routes/**/*.rb'].each { |f| require f }
  Dir[File.dirname(__FILE__) + '/helpers/*.rb'].each { |f| require f }
  Dir[File.dirname(__FILE__) + '/lib/*.rb'].each { |f| require f }

  route do |r|
    r.multi_route

    r.root do
      view 'index'
    end
  end
end
