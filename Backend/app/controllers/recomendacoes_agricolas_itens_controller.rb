class RecomendacoesAgricolasItensController < ApplicationController
  before_action :set_recomendacoes_agricolas_iten, only: %i[ show edit update destroy ]

  # GET /recomendacoes_agricolas_itens or /recomendacoes_agricolas_itens.json
  def index
    @recomendacoes_agricolas_itens = RecomendacoesAgricolasIten.all
  end

  # GET /recomendacoes_agricolas_itens/1 or /recomendacoes_agricolas_itens/1.json
  def show
  end

  # GET /recomendacoes_agricolas_itens/new
  def new
    @recomendacoes_agricolas_iten = RecomendacoesAgricolasIten.new
  end

  # GET /recomendacoes_agricolas_itens/1/edit
  def edit
  end

  # POST /recomendacoes_agricolas_itens or /recomendacoes_agricolas_itens.json
  def create
    @recomendacoes_agricolas_iten = RecomendacoesAgricolasIten.new(recomendacoes_agricolas_iten_params)

    respond_to do |format|
      if @recomendacoes_agricolas_iten.save
        format.html { redirect_to @recomendacoes_agricolas_iten, notice: "Recomendacoes agricolas iten was successfully created." }
        format.json { render :show, status: :created, location: @recomendacoes_agricolas_iten }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @recomendacoes_agricolas_iten.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /recomendacoes_agricolas_itens/1 or /recomendacoes_agricolas_itens/1.json
  def update
    respond_to do |format|
      if @recomendacoes_agricolas_iten.update(recomendacoes_agricolas_iten_params)
        format.html { redirect_to @recomendacoes_agricolas_iten, notice: "Recomendacoes agricolas iten was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @recomendacoes_agricolas_iten }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @recomendacoes_agricolas_iten.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /recomendacoes_agricolas_itens/1 or /recomendacoes_agricolas_itens/1.json
  def destroy
    @recomendacoes_agricolas_iten.destroy!

    respond_to do |format|
      format.html { redirect_to recomendacoes_agricolas_itens_path, notice: "Recomendacoes agricolas iten was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recomendacoes_agricolas_iten
      @recomendacoes_agricolas_iten = RecomendacoesAgricolasIten.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def recomendacoes_agricolas_iten_params
      params.expect(recomendacoes_agricolas_iten: [ :recomendacoes_agricola_id, :principios_ativos_id, :insumo_id, :dose, :quantidade ])
    end
end
