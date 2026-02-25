class FichamentosController < ApplicationController
  before_action :set_fichamento, only: %i[ show edit update destroy ]

  # GET /fichamentos or /fichamentos.json
  def index
    @fichamentos = Fichamento.all
  end

  # GET /fichamentos/1 or /fichamentos/1.json
  def show
  end

  # GET /fichamentos/new
  def new
    @fichamento = Fichamento.new
  end

  # GET /fichamentos/1/edit
  def edit
  end

  # POST /fichamentos or /fichamentos.json
  def create
    @fichamento = Fichamento.new(fichamento_params)

    respond_to do |format|
      if @fichamento.save
        format.html { redirect_to @fichamento, notice: "Fichamento was successfully created." }
        format.json { render :show, status: :created, location: @fichamento }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @fichamento.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /fichamentos/1 or /fichamentos/1.json
  def update
    respond_to do |format|
      if @fichamento.update(fichamento_params)
        format.html { redirect_to @fichamento, notice: "Fichamento was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @fichamento }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @fichamento.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fichamentos/1 or /fichamentos/1.json
  def destroy
    @fichamento.destroy!

    respond_to do |format|
      format.html { redirect_to fichamentos_path, notice: "Fichamento was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fichamento
      @fichamento = Fichamento.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def fichamento_params
      params.expect(fichamento: [ :parametro_metrica_id, :classificacao, :valor_min, :valor_max ])
    end
end
