 if App.enviroment != :headless
  ENV['TEST_URL'] = nil
 end
def link_js(filename)
  "#{ENV['BASE_URL']||ENV['TEST_URL']}/js/#{filename}.js" 
end

def link_css(filename)
  "#{ENV['BASE_URL']||ENV['TEST_URL']}/css/#{filename}.css"
end

def link_min(filename)
  "#{ENV['BASE_URL']||ENV['TEST_URL']}/css/#{filename}.min.js"
end


def link_img(filename, ext: "jpg")
  "#{ENV['BASE_URL']||ENV['TEST_URL']}/img/#{filename}.#{ext}"
end