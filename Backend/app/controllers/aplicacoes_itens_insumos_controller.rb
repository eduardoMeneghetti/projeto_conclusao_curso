class AplicacoesItensInsumosController < ApplicationController
  before_action :set_aplicacoes_itens_insumo, only: %i[ show edit update destroy ]

  # GET /aplicacoes_itens_insumos or /aplicacoes_itens_insumos.json
  def index
    @aplicacoes_itens_insumos = AplicacoesItensInsumo.all
  end

  # GET /aplicacoes_itens_insumos/1 or /aplicacoes_itens_insumos/1.json
  def show
  end

  # GET /aplicacoes_itens_insumos/new
  def new
    @aplicacoes_itens_insumo = AplicacoesItensInsumo.new
  end

  # GET /aplicacoes_itens_insumos/1/edit
  def edit
  end

  # POST /aplicacoes_itens_insumos or /aplicacoes_itens_insumos.json
  def create
    @aplicacoes_itens_insumo = AplicacoesItensInsumo.new(aplicacoes_itens_insumo_params)

    respond_to do |format|
      if @aplicacoes_itens_insumo.save
        format.html { redirect_to @aplicacoes_itens_insumo, notice: "Aplicacoes itens insumo was successfully created." }
        format.json { render :show, status: :created, location: @aplicacoes_itens_insumo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @aplicacoes_itens_insumo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /aplicacoes_itens_insumos/1 or /aplicacoes_itens_insumos/1.json
  def update
    respond_to do |format|
      if @aplicacoes_itens_insumo.update(aplicacoes_itens_insumo_params)
        format.html { redirect_to @aplicacoes_itens_insumo, notice: "Aplicacoes itens insumo was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @aplicacoes_itens_insumo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @aplicacoes_itens_insumo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /aplicacoes_itens_insumos/1 or /aplicacoes_itens_insumos/1.json
  def destroy
    @aplicacoes_itens_insumo.destroy!

    respond_to do |format|
      format.html { redirect_to aplicacoes_itens_insumos_path, notice: "Aplicacoes itens insumo was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_aplicacoes_itens_insumo
      @aplicacoes_itens_insumo = AplicacoesItensInsumo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def aplicacoes_itens_insumo_params
      params.expect(aplicacoes_itens_insumo: [ :aplicacoes_insumo_id, :principios_ativo_id, :insumo_id, :quantidade_aplic, :dose_aplic ])
    end
end
