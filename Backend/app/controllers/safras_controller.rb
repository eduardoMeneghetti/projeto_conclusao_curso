class SafrasController < ApplicationController
  before_action :set_safra, only: [:update]

  def index
    if params[:updated_after]
      @safras = Safra.where('updated_at > ?', params[:updated_after])
    else 
      @safras = Safra.all
    end
      render json: @safras
  end

  def sync_safras
    safras = params[:safras]
    resultado = []
  
    safras.each do |safra|
      existing = Safra.find_by(id: safra[:server_id])

      if existing 
        existing.update(
          descricao: safra[:descricao],
          data_inicio: safra[:data_inicio],
          data_final: safra[:data_final],
          ativo: safra[:ativo]
        )
        resultado << { id: existing.id, local_id: safra[:id]}
      else 
        novo = Safra.create(
          descricao: safra[:descricao],
          data_inicio: safra[:data_inicio],
          data_final: safra[:data_final],
          ativo: safra[:ativo]
        )
        resultado << { id: novo.id, local_id: safra[:id]}
      end
    end
    render json: { message: 'Safras sincornizadas ', safras: resultado}, status: :ok
  end

  def update
      if @safra.update(safra_params)
        render json: @safra, status: :ok
      else
        render json: @safra.errors, status: :unprocessable_entity
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
