class AnalisesSolosController < ApplicationController
  before_action :set_analises_solo, only: [:update]

  def index
    if params[:updated_after]
      @analises_solos = AnalisesSolo.where('updated_at > ?', params[:updated_after])
    else
      @analises_solos = AnalisesSolo.all
    end
    render json: @analises_solos
  end

  def sync_analises_solos
    analises_solos = params[:analises_solos]
    resultado = []

    analises_solos.each do |item|
      existing = AnalisesSolo.find_by(id: item[:server_id])

      atividade_safra = AtividadeSafra.find_by(id: item[:atividade_safra_id])
      atividade_id    = item[:atividade_id]   || atividade_safra&.atividade_id
      propriedade_id  = item[:propriedade_id] || atividade_safra&.propriedade_id
      safra_id        = item[:safra_id]       || atividade_safra&.safra_id

      campos = {
        atividade_gleba_id: item[:atividade_gleba_id],
        atividade_safra_id: item[:atividade_safra_id],
        atividade_id:       atividade_id,
        propriedade_id:     propriedade_id,
        safra_id:           safra_id,
        data_coleta:        item[:data_coleta],
        ativo:              item[:ativo]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = AnalisesSolo.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Análises de solos sincronizadas', analises_solos: resultado }, status: :ok
  end

  def update
    if @analises_solo.update(analises_solo_params)
      render json: @analises_solo, status: :ok
    else
      render json: @analises_solo.errors, status: :unprocessable_entity
    end
  end

  private

  def set_analises_solo
    @analises_solo = AnalisesSolo.find(params.expect(:id))
  end

  def analises_solo_params
    params.expect(analises_solo: [:propriedade_id, :safra_id, :atividade_id, :atividade_gleba_id, :atividade_safra_id, :data_coleta, :ativo])
  end
end
