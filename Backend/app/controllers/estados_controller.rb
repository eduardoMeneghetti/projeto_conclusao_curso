class EstadosController < ApplicationController
  before_action :set_estado, only: %i[ show edit update destroy ]

  # GET /estados or /estados.json
  def index
    @estados = Estado.all
  end

  # GET /estados/1 or /estados/1.json
  def show
  end

  # GET /estados/new
  def new
    @estado = Estado.new
  end

  # GET /estados/1/edit
  def edit
  end

  # POST /estados or /estados.json
  def create
    @estado = Estado.new(estado_params)

    respond_to do |format|
      if @estado.save
        format.html { redirect_to @estado, notice: "Estado was successfully created." }
        format.json { render :show, status: :created, location: @estado }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @estado.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /estados/1 or /estados/1.json
  def update
    respond_to do |format|
      if @estado.update(estado_params)
        format.html { redirect_to @estado, notice: "Estado was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @estado }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @estado.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /estados/1 or /estados/1.json
  def destroy
    @estado.destroy!

    respond_to do |format|
      format.html { redirect_to estados_path, notice: "Estado was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_estado
      @estado = Estado.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def estado_params
      params.expect(estado: [ :descricao, :codigo_ibge, :sigla ])
    end
end
