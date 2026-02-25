class AnalisesSolosController < ApplicationController
  before_action :set_analises_solo, only: %i[ show edit update destroy ]

  # GET /analises_solos or /analises_solos.json
  def index
    @analises_solos = AnalisesSolo.all
  end

  # GET /analises_solos/1 or /analises_solos/1.json
  def show
  end

  # GET /analises_solos/new
  def new
    @analises_solo = AnalisesSolo.new
  end

  # GET /analises_solos/1/edit
  def edit
  end

  # POST /analises_solos or /analises_solos.json
  def create
    @analises_solo = AnalisesSolo.new(analises_solo_params)

    respond_to do |format|
      if @analises_solo.save
        format.html { redirect_to @analises_solo, notice: "Analises solo was successfully created." }
        format.json { render :show, status: :created, location: @analises_solo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @analises_solo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /analises_solos/1 or /analises_solos/1.json
  def update
    respond_to do |format|
      if @analises_solo.update(analises_solo_params)
        format.html { redirect_to @analises_solo, notice: "Analises solo was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @analises_solo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @analises_solo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /analises_solos/1 or /analises_solos/1.json
  def destroy
    @analises_solo.destroy!

    respond_to do |format|
      format.html { redirect_to analises_solos_path, notice: "Analises solo was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_analises_solo
      @analises_solo = AnalisesSolo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def analises_solo_params
      params.expect(analises_solo: [ :propriedade_id, :safra_id, :atividade_id, :aatividade_gleba_id, :atividade_safra_id, :data_coleta ])
    end
end
