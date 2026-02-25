class MovimentacaoEstoqueInsumosController < ApplicationController
  before_action :set_movimentacao_estoque_insumo, only: %i[ show edit update destroy ]

  # GET /movimentacao_estoque_insumos or /movimentacao_estoque_insumos.json
  def index
    @movimentacao_estoque_insumos = MovimentacaoEstoqueInsumo.all
  end

  # GET /movimentacao_estoque_insumos/1 or /movimentacao_estoque_insumos/1.json
  def show
  end

  # GET /movimentacao_estoque_insumos/new
  def new
    @movimentacao_estoque_insumo = MovimentacaoEstoqueInsumo.new
  end

  # GET /movimentacao_estoque_insumos/1/edit
  def edit
  end

  # POST /movimentacao_estoque_insumos or /movimentacao_estoque_insumos.json
  def create
    @movimentacao_estoque_insumo = MovimentacaoEstoqueInsumo.new(movimentacao_estoque_insumo_params)

    respond_to do |format|
      if @movimentacao_estoque_insumo.save
        format.html { redirect_to @movimentacao_estoque_insumo, notice: "Movimentacao estoque insumo was successfully created." }
        format.json { render :show, status: :created, location: @movimentacao_estoque_insumo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @movimentacao_estoque_insumo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /movimentacao_estoque_insumos/1 or /movimentacao_estoque_insumos/1.json
  def update
    respond_to do |format|
      if @movimentacao_estoque_insumo.update(movimentacao_estoque_insumo_params)
        format.html { redirect_to @movimentacao_estoque_insumo, notice: "Movimentacao estoque insumo was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @movimentacao_estoque_insumo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @movimentacao_estoque_insumo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /movimentacao_estoque_insumos/1 or /movimentacao_estoque_insumos/1.json
  def destroy
    @movimentacao_estoque_insumo.destroy!

    respond_to do |format|
      format.html { redirect_to movimentacao_estoque_insumos_path, notice: "Movimentacao estoque insumo was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_movimentacao_estoque_insumo
      @movimentacao_estoque_insumo = MovimentacaoEstoqueInsumo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def movimentacao_estoque_insumo_params
      params.expect(movimentacao_estoque_insumo: [ :quantidade, :valor_unitario, :ajuste_estoque_id, :insumo_id ])
    end
end
