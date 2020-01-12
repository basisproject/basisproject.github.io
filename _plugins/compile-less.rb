require 'less'

module Jekyll
  class CompileLess < Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /^\.less$/i
    end

    def output_ext(ext)
      ".css"
    end

    def convert(content)
      parser = ::Less::Parser.new
      tree = parser.parse(content)
      tree.to_css
    end
  end
end

