# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
    before_action :authenticate_request

    private

    def authenticate_request
        token = request.headers['Authorization']&.split(' ')&.last
        decoded = JsonWebToken.decode(token)

        unless decoded
            render json: { error: "Token inválido" }, status: :unauthorized
        end
    end
end