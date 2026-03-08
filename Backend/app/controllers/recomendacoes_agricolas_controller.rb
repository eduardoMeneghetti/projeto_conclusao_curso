class RecomendacoesAgricolasController < ApplicationController
  before_action :set_recomendacoes_agricola, only: %i[ show edit update destroy ]

  # GET /recomendacoes_agricolas or /recomendacoes_agricolas.json
  def index
    @recomendacoes_agricolas = RecomendacoesAgricola.all
  end

  # GET /recomendacoes_agricolas/1 or /recomendacoes_agricolas/1.json
  def show
  end

  # GET /recomendacoes_agricolas/new
  def new
    @recomendacoes_agricola = RecomendacoesAgricola.new
  end

  # GET /recomendacoes_agricolas/1/edit
  def edit
  end

  # POST /recomendacoes_agricolas or /recomendacoes_agricolas.json
  def create
    @recomendacoes_agricola = RecomendacoesAgricola.new(recomendacoes_agricola_params)

    respond_to do |format|
      if @recomendacoes_agricola.save
        format.html { redirect_to @recomendacoes_agricola, notice: "Recomendacoes agricola was successfully created." }
        format.json { render :show, status: :created, location: @recomendacoes_agricola }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @recomendacoes_agricola.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /recomendacoes_agricolas/1 or /recomendacoes_agricolas/1.json
  def update
    respond_to do |format|
      if @recomendacoes_agricola.update(recomendacoes_agricola_params)
        format.html { redirect_to @recomendacoes_agricola, notice: "Recomendacoes agricola was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @recomendacoes_agricola }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @recomendacoes_agricola.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /recomendacoes_agricolas/1 or /recomendacoes_agricolas/1.json
  def destroy
    @recomendacoes_agricola.destroy!

    respond_to do |format|
      format.html { redirect_to recomendacoes_agricolas_path, notice: "Recomendacoes agricola was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recomendacoes_agricola
      @recomendacoes_agricola = RecomendacoesAgricola.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def recomendacoes_agricola_params
      params.expect(recomendacoes_agricola: [ :safra_id, :atividade_id, :analises_solo_id, :propriedade_id, :atividade_gleba_id, :atividade_safra_id, :data_recomendacao, :recomendante, :operador ])
    end
end
