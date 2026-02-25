class GlebasController < ApplicationController
  before_action :set_gleba, only: %i[ show edit update destroy ]

  # GET /glebas or /glebas.json
  def index
    @glebas = Gleba.all
  end

  # GET /glebas/1 or /glebas/1.json
  def show
  end

  # GET /glebas/new
  def new
    @gleba = Gleba.new
  end

  # GET /glebas/1/edit
  def edit
  end

  # POST /glebas or /glebas.json
  def create
    @gleba = Gleba.new(gleba_params)

    respond_to do |format|
      if @gleba.save
        format.html { redirect_to @gleba, notice: "Gleba was successfully created." }
        format.json { render :show, status: :created, location: @gleba }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @gleba.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /glebas/1 or /glebas/1.json
  def update
    respond_to do |format|
      if @gleba.update(gleba_params)
        format.html { redirect_to @gleba, notice: "Gleba was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @gleba }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @gleba.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /glebas/1 or /glebas/1.json
  def destroy
    @gleba.destroy!

    respond_to do |format|
      format.html { redirect_to glebas_path, notice: "Gleba was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gleba
      @gleba = Gleba.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def gleba_params
      params.expect(gleba: [ :descricao, :ativo, :area_hectares, :propriedade_id ])
    end
end
