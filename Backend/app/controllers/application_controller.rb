# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
    before_action :authenticate_request

    rescue_from ActiveRecord::RecordNotFound do |e|
        render json: { error: e.message }, status: :not_found
    end

    rescue_from ActiveRecord::ValueTooLong, ActiveRecord::StatementInvalid do |e|
        render json: { error: e.message }, status: :unprocessable_entity
    end

    rescue_from StandardError do |e|
        render json: { error: e.message }, status: :internal_server_error
    end

    private

    def authenticate_request
        token = request.headers['Authorization']&.split(' ')&.last
        decoded = JsonWebToken.decode(token)

        unless decoded
            render json: { error: "Token inválido" }, status: :unauthorized
        end
    end
end