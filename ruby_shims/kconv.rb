# Minimal kconv shim for Ruby 3.4 compatibility
module Kconv
  def self.toutf8(str)
    str.respond_to?(:encode) ? str.encode('UTF-8', invalid: :replace, undef: :replace) : str
  end

  def self.kconv(str, encoding)
    # no-op compatibility; callers expect a string
    str
  end
end

class String
  unless method_defined?(:toutf8)
    def toutf8
      respond_to?(:encode) ? encode('UTF-8', invalid: :replace, undef: :replace) : self
    end
  end
end
