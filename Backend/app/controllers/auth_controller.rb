class AuthController < ApplicationController
    skip_before_action :authenticate_request, only: [:sync_usuarios, :login]  

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


    def login
    usuario = Usuario.find_by(usuario: params[:usuario])
    senha_hash = Digest::SHA256.hexdigest(params[:senha])

    if usuario && usuario.senha == senha_hash
        token = JsonWebToken.encode(user_id: usuario.id)
        render json: { 
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                usuario: usuario.usuario,
                email: usuario.email,
                operador: usuario.operador,
                recomendante: usuario.recomendante
            }
        }, status: :ok
    else
        render json: { error: 'Usuário ou senha inválidos' }, status: :unauthorized
    end
end
end