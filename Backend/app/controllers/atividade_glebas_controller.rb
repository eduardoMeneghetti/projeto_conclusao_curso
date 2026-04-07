class AtividadeGlebasController < ApplicationController
  before_action :set_atividade_gleba, only: [   :update  ]

  def index
    if params[:updated_after]
      @atividade_glebas = AtividadeGleba.where('updated_at > ?', params[:updated_after])
    else 
      @atividade_glebas = AtividadeGleba.all
    end
    render json: @atividade_glebas
  end

  def update
    if @atividade_gleba.update(atividade_gleba_params)
      render json: @atividade_gleba, status: :ok
    else
      render json: @atividade_gleba.errors, status: :unprocessable_entity
    end
  end

  def sync_atividade_glebas
    atividade_glebas = params[:atividade_glebas]
    resultado = []
    
    atividade_glebas.each do |atividade_gleba|
      existing = AtividadeGleba.find_by(id: atividade_gleba[:server_id])

      if existing
        existing.update(
          gleba_id: atividade_gleba[:gleba_id],
          atividade_safra_id: atividade_gleba[:atividade_safra_id]
        )
        resultado << { id: existing.id, local_id: atividade_gleba[:id] }
      else
        novo = AtividadeGleba.create(
          gleba_id: atividade_gleba[:gleba_id],
          atividade_safra_id: atividade_gleba[:atividade_safra_id]
        )
        resultado << { id: novo.id, local_id: atividade_gleba[:id] }
      end
    end
    render json: { message: 'AtividadeGlebas sincronizadas', atividade_glebas: resultado }, status: :ok
  end 
  
  private
   
    def set_atividade_gleba
      @atividade_gleba = AtividadeGleba.find(params.expect(:id))
    end

    def atividade_gleba_params
      params.expect(atividade_gleba: [ :gleba_id, :atividade_safra_id ])
    end
end
