class UnidadesMedidasController < ApplicationController
  before_action :set_unidades_medida, only: %i[ show edit update destroy ]

  # GET /unidades_medidas or /unidades_medidas.json
  def index
    @unidades_medidas = UnidadesMedida.all
  end

  # GET /unidades_medidas/1 or /unidades_medidas/1.json
  def show
  end

  # GET /unidades_medidas/new
  def new
    @unidades_medida = UnidadesMedida.new
  end

  # GET /unidades_medidas/1/edit
  def edit
  end

  # POST /unidades_medidas or /unidades_medidas.json
  def create
    @unidades_medida = UnidadesMedida.new(unidades_medida_params)

    respond_to do |format|
      if @unidades_medida.save
        format.html { redirect_to @unidades_medida, notice: "Unidades medida was successfully created." }
        format.json { render :show, status: :created, location: @unidades_medida }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @unidades_medida.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /unidades_medidas/1 or /unidades_medidas/1.json
  def update
    respond_to do |format|
      if @unidades_medida.update(unidades_medida_params)
        format.html { redirect_to @unidades_medida, notice: "Unidades medida was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @unidades_medida }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @unidades_medida.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /unidades_medidas/1 or /unidades_medidas/1.json
  def destroy
    @unidades_medida.destroy!

    respond_to do |format|
      format.html { redirect_to unidades_medidas_path, notice: "Unidades medida was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_unidades_medida
      @unidades_medida = UnidadesMedida.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def unidades_medida_params
      params.expect(unidades_medida: [ :descrcicao ])
    end
end
