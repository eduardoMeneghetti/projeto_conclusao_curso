class PropriedadesController < ApplicationController
  before_action :set_propriedade, only: %i[ show edit update destroy ]

  # GET /propriedades or /propriedades.json
  def index
    @propriedades = Propriedade.all
  end

  # GET /propriedades/1 or /propriedades/1.json
  def show
  end

  # GET /propriedades/new
  def new
    @propriedade = Propriedade.new
  end

  # GET /propriedades/1/edit
  def edit
  end

  # POST /propriedades or /propriedades.json
  def create
    @propriedade = Propriedade.new(propriedade_params)

    respond_to do |format|
      if @propriedade.save
        format.html { redirect_to @propriedade, notice: "Propriedade was successfully created." }
        format.json { render :show, status: :created, location: @propriedade }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @propriedade.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /propriedades/1 or /propriedades/1.json
  def update
    respond_to do |format|
      if @propriedade.update(propriedade_params)
        format.html { redirect_to @propriedade, notice: "Propriedade was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @propriedade }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @propriedade.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /propriedades/1 or /propriedades/1.json
  def destroy
    @propriedade.destroy!

    respond_to do |format|
      format.html { redirect_to propriedades_path, notice: "Propriedade was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_propriedade
      @propriedade = Propriedade.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def propriedade_params
      params.expect(propriedade: [ :descricao, :hectare, :cidade_id ])
    end
end
