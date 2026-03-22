# app/services/json_web_token.rb
class JsonWebToken
    SECRET_KEY = Rails.application.secret_key_base

    def self.encode(payload)
        JWT.encode(payload, SECRET_KEY)
    end

    def self.decode(token)
        JWT.decode(token, SECRET_KEY)[0]
    rescue
        nil
    end
end