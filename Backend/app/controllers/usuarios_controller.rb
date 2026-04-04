class UsuariosController < ApplicationController
  before_action :set_usuario, only: %i[ show edit update destroy ]

  # GET /usuarios or /usuarios.json
  def index
    if params[:updated_after]
        @usuarios = Usuario.where('updated_at > ?', params[:updated_after])
    else
        @usuarios = Usuario.all
    end
    render json: @usuarios
  end

  # GET /usuarios/1 or /usuarios/1.json
  def show
  end

  # GET /usuarios/new
  def new
    @usuario = Usuario.new
  end

  # GET /usuarios/1/edit
  def edit
  end

 
  def create
    @usuario = Usuario.new(usuario_params)

    if @usuario.save
        render json: @usuario, status: :created  # 👈 retorna JSON direto
    else
        render json: @usuario.errors, status: :unprocessable_entity
    end
 end

  def update
    if @usuario.update(usuario_params)
        render json: @usuario, status: :ok  # 👈 retorna JSON direto
    else
        render json: @usuario.errors, status: :unprocessable_entity
    end
  end

  # DELETE /usuarios/1 or /usuarios/1.json
  def destroy
    @usuario.destroy!

    respond_to do |format|
      format.html { redirect_to usuarios_path, notice: "Usuario was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    def set_usuario
      @usuario = Usuario.find(params.expect(:id))
    end

    def usuario_params
    params.expect(usuario: [:nome, :usuario, :senha, :email, :operador, :recomendante, :ativo])  # 👈 adiciona ativo
    end
end
