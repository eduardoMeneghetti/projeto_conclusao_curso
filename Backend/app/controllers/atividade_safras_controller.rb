class AtividadeSafrasController < ApplicationController
  before_action :set_atividade_safra, only: %i[ show edit update destroy ]

  # GET /atividade_safras or /atividade_safras.json
  def index
    @atividade_safras = AtividadeSafra.all
  end

  # GET /atividade_safras/1 or /atividade_safras/1.json
  def show
  end

  # GET /atividade_safras/new
  def new
    @atividade_safra = AtividadeSafra.new
  end

  # GET /atividade_safras/1/edit
  def edit
  end

  # POST /atividade_safras or /atividade_safras.json
  def create
    @atividade_safra = AtividadeSafra.new(atividade_safra_params)

    respond_to do |format|
      if @atividade_safra.save
        format.html { redirect_to @atividade_safra, notice: "Atividade safra was successfully created." }
        format.json { render :show, status: :created, location: @atividade_safra }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @atividade_safra.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /atividade_safras/1 or /atividade_safras/1.json
  def update
    respond_to do |format|
      if @atividade_safra.update(atividade_safra_params)
        format.html { redirect_to @atividade_safra, notice: "Atividade safra was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @atividade_safra }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @atividade_safra.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /atividade_safras/1 or /atividade_safras/1.json
  def destroy
    @atividade_safra.destroy!

    respond_to do |format|
      format.html { redirect_to atividade_safras_path, notice: "Atividade safra was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_atividade_safra
      @atividade_safra = AtividadeSafra.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def atividade_safra_params
      params.expect(atividade_safra: [ :atividade_id, :safra_id, :propriedade_id ])
    end
end
