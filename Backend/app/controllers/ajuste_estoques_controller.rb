class AjusteEstoquesController < ApplicationController
  before_action :set_ajuste_estoque, only: %i[ show edit update destroy ]

  # GET /ajuste_estoques or /ajuste_estoques.json
  def index
    @ajuste_estoques = AjusteEstoque.all
  end

  # GET /ajuste_estoques/1 or /ajuste_estoques/1.json
  def show
  end

  # GET /ajuste_estoques/new
  def new
    @ajuste_estoque = AjusteEstoque.new
  end

  # GET /ajuste_estoques/1/edit
  def edit
  end

  # POST /ajuste_estoques or /ajuste_estoques.json
  def create
    @ajuste_estoque = AjusteEstoque.new(ajuste_estoque_params)

    respond_to do |format|
      if @ajuste_estoque.save
        format.html { redirect_to @ajuste_estoque, notice: "Ajuste estoque was successfully created." }
        format.json { render :show, status: :created, location: @ajuste_estoque }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @ajuste_estoque.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ajuste_estoques/1 or /ajuste_estoques/1.json
  def update
    respond_to do |format|
      if @ajuste_estoque.update(ajuste_estoque_params)
        format.html { redirect_to @ajuste_estoque, notice: "Ajuste estoque was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @ajuste_estoque }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @ajuste_estoque.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ajuste_estoques/1 or /ajuste_estoques/1.json
  def destroy
    @ajuste_estoque.destroy!

    respond_to do |format|
      format.html { redirect_to ajuste_estoques_path, notice: "Ajuste estoque was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ajuste_estoque
      @ajuste_estoque = AjusteEstoque.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def ajuste_estoque_params
      params.expect(ajuste_estoque: [ :usuario_id, :propriedade_id, :observacao, :data, :entrada_saida ])
    end
end
