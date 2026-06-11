class AtividadesController < ApplicationController
  before_action :set_atividade, only:[ :update ]

  def index 
    if params[:updated_after]
      @atividades = Atividade.where('updated_at > ?', params[:updated_after])
    else
      @atividades = Atividade.all
    end
      render json: @atividades
  end

  def sync_atividades
    atividades = params[:atividades]
    resultado = []

    atividades.each do |atividade|
      existing = Atividade.find_by(id: atividade[:server_id])
      existing ||= Atividade.find_by(descricao: atividade[:descricao])

      campos = { descricao: atividade[:descricao], cor: atividade[:cor], ativo: atividade[:ativo] }

      if existing
        existing.update(campos)
        resultado << { id: existing.id, local_id: atividade[:id] }
      else
        novo = Atividade.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: atividade[:id] }
        else
          resultado << { id: nil, local_id: atividade[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Atividades sincronizadas ', atividades: resultado}, status: :ok
  end

  def update 
    if @atividade.update(atividade_params)
      render json: @atividade, status: :ok
    else
      render json: @atividade.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_atividade
      @atividade = Atividade.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def atividade_params
      params.expect(atividade: [ :descricao, :cor, :ativo ])
    end
end
