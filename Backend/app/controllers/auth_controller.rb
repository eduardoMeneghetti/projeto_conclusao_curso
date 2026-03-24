# app/controllers/auth_controller.rb
class AuthController < ApplicationController
    skip_before_action :authenticate_request, only: [:sync_usuarios]  

  def sync_usuarios
    usuarios = params[:usuarios]
    resultado = []

    usuarios.each do |usuario|
        existing = Usuario.find_by(usuario: usuario[:usuario])

        if existing
            existing.update(
                nome: usuario[:nome],
                senha: usuario[:senha],
                email: usuario[:email],
                ativo: usuario[:ativo],
                recomendante: usuario[:recomendante],
                operador: usuario[:operador]
            )
            # 👇 retorna o id do servidor e o id local
            resultado << { id: existing.id, local_id: usuario[:id] }
        else
            novo = Usuario.create(
                nome: usuario[:nome],
                usuario: usuario[:usuario],
                senha: usuario[:senha],
                email: usuario[:email],
                ativo: usuario[:ativo],
                recomendante: usuario[:recomendante],
                operador: usuario[:operador]
            )
            resultado << { id: novo.id, local_id: usuario[:id] }
        end
    end

    render json: { message: 'Usuários sincronizados', usuarios: resultado }, status: :ok
    end
end