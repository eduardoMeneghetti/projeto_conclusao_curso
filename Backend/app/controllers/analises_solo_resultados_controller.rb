class AnalisesSoloResultadosController < ApplicationController
  before_action :set_analises_solo_resultado, only: %i[ show edit update destroy ]

  # GET /analises_solo_resultados or /analises_solo_resultados.json
  def index
    @analises_solo_resultados = AnalisesSoloResultado.all
  end

  # GET /analises_solo_resultados/1 or /analises_solo_resultados/1.json
  def show
  end

  # GET /analises_solo_resultados/new
  def new
    @analises_solo_resultado = AnalisesSoloResultado.new
  end

  # GET /analises_solo_resultados/1/edit
  def edit
  end

  # POST /analises_solo_resultados or /analises_solo_resultados.json
  def create
    @analises_solo_resultado = AnalisesSoloResultado.new(analises_solo_resultado_params)

    respond_to do |format|
      if @analises_solo_resultado.save
        format.html { redirect_to @analises_solo_resultado, notice: "Analises solo resultado was successfully created." }
        format.json { render :show, status: :created, location: @analises_solo_resultado }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @analises_solo_resultado.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /analises_solo_resultados/1 or /analises_solo_resultados/1.json
  def update
    respond_to do |format|
      if @analises_solo_resultado.update(analises_solo_resultado_params)
        format.html { redirect_to @analises_solo_resultado, notice: "Analises solo resultado was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @analises_solo_resultado }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @analises_solo_resultado.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /analises_solo_resultados/1 or /analises_solo_resultados/1.json
  def destroy
    @analises_solo_resultado.destroy!

    respond_to do |format|
      format.html { redirect_to analises_solo_resultados_path, notice: "Analises solo resultado was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_analises_solo_resultado
      @analises_solo_resultado = AnalisesSoloResultado.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def analises_solo_resultado_params
      params.expect(analises_solo_resultado: [ :analises_solo_id, :parametro_medido, :parametro_medido_id, :valor ])
    end
end
