class SafrasController < ApplicationController
  before_action :set_safra, only: %i[ show edit update destroy ]

  # GET /safras or /safras.json
  def index
    @safras = Safra.all
  end

  # GET /safras/1 or /safras/1.json
  def show
  end

  # GET /safras/new
  def new
    @safra = Safra.new
  end

  # GET /safras/1/edit
  def edit
  end

  # POST /safras or /safras.json
  def create
    @safra = Safra.new(safra_params)

    respond_to do |format|
      if @safra.save
        format.html { redirect_to @safra, notice: "Safra was successfully created." }
        format.json { render :show, status: :created, location: @safra }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @safra.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /safras/1 or /safras/1.json
  def update
    respond_to do |format|
      if @safra.update(safra_params)
        format.html { redirect_to @safra, notice: "Safra was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @safra }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @safra.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /safras/1 or /safras/1.json
  def destroy
    @safra.destroy!

    respond_to do |format|
      format.html { redirect_to safras_path, notice: "Safra was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_safra
      @safra = Safra.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def safra_params
      params.expect(safra: [ :descricao, :data_inicio, :data_final, :ativo])
    end
end
