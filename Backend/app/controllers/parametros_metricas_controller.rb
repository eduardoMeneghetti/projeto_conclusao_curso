class ParametrosMetricasController < ApplicationController
  before_action :set_parametros_metrica, only: %i[ show edit update destroy ]

  # GET /parametros_metricas or /parametros_metricas.json
  def index
    @parametros_metricas = ParametrosMetrica.all
  end

  # GET /parametros_metricas/1 or /parametros_metricas/1.json
  def show
  end

  # GET /parametros_metricas/new
  def new
    @parametros_metrica = ParametrosMetrica.new
  end

  # GET /parametros_metricas/1/edit
  def edit
  end

  # POST /parametros_metricas or /parametros_metricas.json
  def create
    @parametros_metrica = ParametrosMetrica.new(parametros_metrica_params)

    respond_to do |format|
      if @parametros_metrica.save
        format.html { redirect_to @parametros_metrica, notice: "Parametros metrica was successfully created." }
        format.json { render :show, status: :created, location: @parametros_metrica }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @parametros_metrica.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parametros_metricas/1 or /parametros_metricas/1.json
  def update
    respond_to do |format|
      if @parametros_metrica.update(parametros_metrica_params)
        format.html { redirect_to @parametros_metrica, notice: "Parametros metrica was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @parametros_metrica }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @parametros_metrica.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /parametros_metricas/1 or /parametros_metricas/1.json
  def destroy
    @parametros_metrica.destroy!

    respond_to do |format|
      format.html { redirect_to parametros_metricas_path, notice: "Parametros metrica was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_parametros_metrica
      @parametros_metrica = ParametrosMetrica.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def parametros_metrica_params
      params.expect(parametros_metrica: [ :tipo, :descricao ])
    end
end
