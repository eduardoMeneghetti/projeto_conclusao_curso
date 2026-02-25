class AplicaoesInsumosController < ApplicationController
  before_action :set_aplicaoes_insumo, only: %i[ show edit update destroy ]

  # GET /aplicaoes_insumos or /aplicaoes_insumos.json
  def index
    @aplicaoes_insumos = AplicaoesInsumo.all
  end

  # GET /aplicaoes_insumos/1 or /aplicaoes_insumos/1.json
  def show
  end

  # GET /aplicaoes_insumos/new
  def new
    @aplicaoes_insumo = AplicaoesInsumo.new
  end

  # GET /aplicaoes_insumos/1/edit
  def edit
  end

  # POST /aplicaoes_insumos or /aplicaoes_insumos.json
  def create
    @aplicaoes_insumo = AplicaoesInsumo.new(aplicaoes_insumo_params)

    respond_to do |format|
      if @aplicaoes_insumo.save
        format.html { redirect_to @aplicaoes_insumo, notice: "Aplicaoes insumo was successfully created." }
        format.json { render :show, status: :created, location: @aplicaoes_insumo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @aplicaoes_insumo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /aplicaoes_insumos/1 or /aplicaoes_insumos/1.json
  def update
    respond_to do |format|
      if @aplicaoes_insumo.update(aplicaoes_insumo_params)
        format.html { redirect_to @aplicaoes_insumo, notice: "Aplicaoes insumo was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @aplicaoes_insumo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @aplicaoes_insumo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /aplicaoes_insumos/1 or /aplicaoes_insumos/1.json
  def destroy
    @aplicaoes_insumo.destroy!

    respond_to do |format|
      format.html { redirect_to aplicaoes_insumos_path, notice: "Aplicaoes insumo was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_aplicaoes_insumo
      @aplicaoes_insumo = AplicaoesInsumo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def aplicaoes_insumo_params
      params.expect(aplicaoes_insumo: [ :propriedade_id, :atividade_id, :atividade_safra_id, :atividade_gleba_id, :usuario_id, :maquina_id, :operador, :recomendacoes_agricola_id, :area_aplic, :data_inicio, :data_final ])
    end
end
