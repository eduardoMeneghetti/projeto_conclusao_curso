class AtividadeSafrasController < ApplicationController
  before_action :set_atividade_safra, only: [:update]

  def index
    if params[:updated_after]  
      @atividade_safras = AtividadeSafra.where('updated_at > ?', params[:updated_after])
    else
      @atividade_safras = AtividadeSafra.all
    end
    render json: @atividade_safras
  end
 
  def update
    if @atividade_safra.update(atividade_safra_params)
      render json: @atividade_safra, status: :ok
    else
      render json: @atividade_safra.errors, status: :unprocessable_entity
    end
  end

  def sync_atividade_safras
    atividade_safras = params[:atividade_safras]  
    resultado = []

    atividade_safras.each do |atividade_safra|
      existing = AtividadeSafra.find_by(id: atividade_safra[:server_id])

      if existing
        existing.update(
          atividade_id: atividade_safra[:atividade_id],
          safra_id: atividade_safra[:safra_id],
          propriedade_id: atividade_safra[:propriedade_id]
        )
        resultado << { id: existing.id, local_id: atividade_safra[:id] }
      else
        novo = AtividadeSafra.create(
          atividade_id: atividade_safra[:atividade_id],
          safra_id: atividade_safra[:safra_id],
          propriedade_id: atividade_safra[:propriedade_id]
        )
        resultado << { id: novo.id, local_id: atividade_safra[:id] }
      end
    end

    render json: { message: 'Atividade safras sincronizadas', atividade_safras: resultado }, status: :ok
  end  

  private

  def set_atividade_safra
    @atividade_safra = AtividadeSafra.find(params.expect(:id))
  end

  def atividade_safra_params
    params.expect(atividade_safra: [:atividade_id, :safra_id, :propriedade_id])
  end
end  