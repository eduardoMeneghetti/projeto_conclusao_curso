class PrincipiosAtivosNutrientesController < ApplicationController
  before_action :set_principios_ativos_nutriente, only: %i[ show edit update destroy ]

  # GET /principios_ativos_nutrientes or /principios_ativos_nutrientes.json
  def index
    @principios_ativos_nutrientes = PrincipiosAtivosNutriente.all
  end

  # GET /principios_ativos_nutrientes/1 or /principios_ativos_nutrientes/1.json
  def show
  end

  # GET /principios_ativos_nutrientes/new
  def new
    @principios_ativos_nutriente = PrincipiosAtivosNutriente.new
  end

  # GET /principios_ativos_nutrientes/1/edit
  def edit
  end

  # POST /principios_ativos_nutrientes or /principios_ativos_nutrientes.json
  def create
    @principios_ativos_nutriente = PrincipiosAtivosNutriente.new(principios_ativos_nutriente_params)

    respond_to do |format|
      if @principios_ativos_nutriente.save
        format.html { redirect_to @principios_ativos_nutriente, notice: "Principios ativos nutriente was successfully created." }
        format.json { render :show, status: :created, location: @principios_ativos_nutriente }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @principios_ativos_nutriente.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /principios_ativos_nutrientes/1 or /principios_ativos_nutrientes/1.json
  def update
    respond_to do |format|
      if @principios_ativos_nutriente.update(principios_ativos_nutriente_params)
        format.html { redirect_to @principios_ativos_nutriente, notice: "Principios ativos nutriente was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @principios_ativos_nutriente }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @principios_ativos_nutriente.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /principios_ativos_nutrientes/1 or /principios_ativos_nutrientes/1.json
  def destroy
    @principios_ativos_nutriente.destroy!

    respond_to do |format|
      format.html { redirect_to principios_ativos_nutrientes_path, notice: "Principios ativos nutriente was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_principios_ativos_nutriente
      @principios_ativos_nutriente = PrincipiosAtivosNutriente.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def principios_ativos_nutriente_params
      params.expect(principios_ativos_nutriente: [ :principio_ativos_id, :nutriente_id, :percentual ])
    end
end
