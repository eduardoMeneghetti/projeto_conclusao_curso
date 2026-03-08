class PrincipiosAtivosController < ApplicationController
  before_action :set_principios_ativo, only: %i[ show edit update destroy ]

  # GET /principios_ativos or /principios_ativos.json
  def index
    @principios_ativos = PrincipiosAtivo.all
  end

  # GET /principios_ativos/1 or /principios_ativos/1.json
  def show
  end

  # GET /principios_ativos/new
  def new
    @principios_ativo = PrincipiosAtivo.new
  end

  # GET /principios_ativos/1/edit
  def edit
  end

  # POST /principios_ativos or /principios_ativos.json
  def create
    @principios_ativo = PrincipiosAtivo.new(principios_ativo_params)

    respond_to do |format|
      if @principios_ativo.save
        format.html { redirect_to @principios_ativo, notice: "Principios ativo was successfully created." }
        format.json { render :show, status: :created, location: @principios_ativo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @principios_ativo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /principios_ativos/1 or /principios_ativos/1.json
  def update
    respond_to do |format|
      if @principios_ativo.update(principios_ativo_params)
        format.html { redirect_to @principios_ativo, notice: "Principios ativo was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @principios_ativo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @principios_ativo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /principios_ativos/1 or /principios_ativos/1.json
  def destroy
    @principios_ativo.destroy!

    respond_to do |format|
      format.html { redirect_to principios_ativos_path, notice: "Principios ativo was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_principios_ativo
      @principios_ativo = PrincipiosAtivo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def principios_ativo_params
      params.expect(principios_ativo: [ :descricao, :ativo ])
    end
end
