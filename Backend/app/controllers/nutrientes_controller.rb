class NutrientesController < ApplicationController
  before_action :set_nutriente, only: %i[ show edit update destroy ]

  # GET /nutrientes or /nutrientes.json
  def index
    @nutrientes = Nutriente.all
  end

  # GET /nutrientes/1 or /nutrientes/1.json
  def show
  end

  # GET /nutrientes/new
  def new
    @nutriente = Nutriente.new
  end

  # GET /nutrientes/1/edit
  def edit
  end

  # POST /nutrientes or /nutrientes.json
  def create
    @nutriente = Nutriente.new(nutriente_params)

    respond_to do |format|
      if @nutriente.save
        format.html { redirect_to @nutriente, notice: "Nutriente was successfully created." }
        format.json { render :show, status: :created, location: @nutriente }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @nutriente.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /nutrientes/1 or /nutrientes/1.json
  def update
    respond_to do |format|
      if @nutriente.update(nutriente_params)
        format.html { redirect_to @nutriente, notice: "Nutriente was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @nutriente }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @nutriente.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /nutrientes/1 or /nutrientes/1.json
  def destroy
    @nutriente.destroy!

    respond_to do |format|
      format.html { redirect_to nutrientes_path, notice: "Nutriente was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_nutriente
      @nutriente = Nutriente.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def nutriente_params
      params.expect(nutriente: [ :descricao, :sigla, :unidade ])
    end
end
