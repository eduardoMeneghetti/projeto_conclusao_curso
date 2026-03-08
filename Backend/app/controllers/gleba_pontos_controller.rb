class GlebaPontosController < ApplicationController
  before_action :set_gleba_ponto, only: %i[ show edit update destroy ]

  # GET /gleba_pontos or /gleba_pontos.json
  def index
    @gleba_pontos = GlebaPonto.all
  end

  # GET /gleba_pontos/1 or /gleba_pontos/1.json
  def show
  end

  # GET /gleba_pontos/new
  def new
    @gleba_ponto = GlebaPonto.new
  end

  # GET /gleba_pontos/1/edit
  def edit
  end

  # POST /gleba_pontos or /gleba_pontos.json
  def create
    @gleba_ponto = GlebaPonto.new(gleba_ponto_params)

    respond_to do |format|
      if @gleba_ponto.save
        format.html { redirect_to @gleba_ponto, notice: "Gleba ponto was successfully created." }
        format.json { render :show, status: :created, location: @gleba_ponto }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @gleba_ponto.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /gleba_pontos/1 or /gleba_pontos/1.json
  def update
    respond_to do |format|
      if @gleba_ponto.update(gleba_ponto_params)
        format.html { redirect_to @gleba_ponto, notice: "Gleba ponto was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @gleba_ponto }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @gleba_ponto.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gleba_pontos/1 or /gleba_pontos/1.json
  def destroy
    @gleba_ponto.destroy!

    respond_to do |format|
      format.html { redirect_to gleba_pontos_path, notice: "Gleba ponto was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gleba_ponto
      @gleba_ponto = GlebaPonto.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def gleba_ponto_params
      params.expect(gleba_ponto: [ :latitude, :longitude, :ordem, :gleba_id ])
    end
end
