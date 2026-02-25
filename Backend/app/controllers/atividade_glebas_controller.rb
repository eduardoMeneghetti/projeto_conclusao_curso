class AtividadeGlebasController < ApplicationController
  before_action :set_atividade_gleba, only: %i[ show edit update destroy ]

  # GET /atividade_glebas or /atividade_glebas.json
  def index
    @atividade_glebas = AtividadeGleba.all
  end

  # GET /atividade_glebas/1 or /atividade_glebas/1.json
  def show
  end

  # GET /atividade_glebas/new
  def new
    @atividade_gleba = AtividadeGleba.new
  end

  # GET /atividade_glebas/1/edit
  def edit
  end

  # POST /atividade_glebas or /atividade_glebas.json
  def create
    @atividade_gleba = AtividadeGleba.new(atividade_gleba_params)

    respond_to do |format|
      if @atividade_gleba.save
        format.html { redirect_to @atividade_gleba, notice: "Atividade gleba was successfully created." }
        format.json { render :show, status: :created, location: @atividade_gleba }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @atividade_gleba.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /atividade_glebas/1 or /atividade_glebas/1.json
  def update
    respond_to do |format|
      if @atividade_gleba.update(atividade_gleba_params)
        format.html { redirect_to @atividade_gleba, notice: "Atividade gleba was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @atividade_gleba }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @atividade_gleba.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /atividade_glebas/1 or /atividade_glebas/1.json
  def destroy
    @atividade_gleba.destroy!

    respond_to do |format|
      format.html { redirect_to atividade_glebas_path, notice: "Atividade gleba was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_atividade_gleba
      @atividade_gleba = AtividadeGleba.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def atividade_gleba_params
      params.expect(atividade_gleba: [ :gleba_id, :atividade_safra_id ])
    end
end
