class CidadesController < ApplicationController
  before_action :set_cidade, only: %i[ show edit update destroy ]

  # GET /cidades or /cidades.json
  def index
    @cidades = Cidade.all
  end

  # GET /cidades/1 or /cidades/1.json
  def show
  end

  # GET /cidades/new
  def new
    @cidade = Cidade.new
  end

  # GET /cidades/1/edit
  def edit
  end

  # POST /cidades or /cidades.json
  def create
    @cidade = Cidade.new(cidade_params)

    respond_to do |format|
      if @cidade.save
        format.html { redirect_to @cidade, notice: "Cidade was successfully created." }
        format.json { render :show, status: :created, location: @cidade }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @cidade.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cidades/1 or /cidades/1.json
  def update
    respond_to do |format|
      if @cidade.update(cidade_params)
        format.html { redirect_to @cidade, notice: "Cidade was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @cidade }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @cidade.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cidades/1 or /cidades/1.json
  def destroy
    @cidade.destroy!

    respond_to do |format|
      format.html { redirect_to cidades_path, notice: "Cidade was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cidade
      @cidade = Cidade.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def cidade_params
      params.expect(cidade: [ :descricao, :codigo_ibge, :latitude, :longitude, :estado_id ])
    end
end
