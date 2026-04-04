class UsuariosController < ApplicationController
  before_action :set_usuario, only: [:update] 

  def index
    if params[:updated_after]
        @usuarios = Usuario.where('updated_at > ?', params[:updated_after])
    else
        @usuarios = Usuario.all
    end
    render json: @usuarios
  end

  def update 
    if @usuario.update(usuario_params)
        render json: @usuario, status: :ok 
    else
       render json: @usuario.errors, status: :unprocessable_entity
    end
  end

  private
    def set_usuario
      @usuario = Usuario.find(params.expect(:id))
    end

    def usuario_params
    params.expect(usuario: [:nome, :usuario, :senha, :email, :operador, :recomendante, :ativo]) 
    end
end
