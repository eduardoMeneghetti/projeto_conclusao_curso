class RecomendacoesAgricolasController < ApplicationController
  before_action :set_recomendacoes_agricola, only: [:update]

  def index
    if params[:updated_after]
      @recomendacoes_agricolas = RecomendacoesAgricola.where('updated_at > ?', params[:updated_after])
    else
      @recomendacoes_agricolas = RecomendacoesAgricola.all
    end
    render json: @recomendacoes_agricolas
  end

  def sync_recomendacoes_agricolas
    recomendacoes_agricolas = params[:recomendacoes_agricolas]
    resultado = []

    recomendacoes_agricolas.each do |item|
      existing = RecomendacoesAgricola.find_by(id: item[:server_id])

      # mobile envia data_inicio/data_fim; servidor tem data_recomendacao
      data_recomendacao = item[:data_recomendacao] || item[:data_inicio] || item[:data_fim]

      campos = {
        analises_solo_id:  item[:analises_solo_id],
        area_aplic:        item[:area_aplic],
        atividade_gleba_id: item[:atividade_gleba_id],
        atividade_safra_id: item[:atividade_safra_id],
        ativo:             item[:ativo],
        data_recomendacao: data_recomendacao,
        operador_id:       item[:operador_id],
        recomendante_id:   item[:recomendante_id],
        status:            item[:status],
        deleted_at:        item[:deleted_at]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = RecomendacoesAgricola.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Recomendações agrícolas sincronizadas', recomendacoes_agricolas: resultado }, status: :ok
  end

  def update
    if @recomendacoes_agricola.update(recomendacoes_agricola_params)
      render json: @recomendacoes_agricola, status: :ok
    else
      render json: @recomendacoes_agricola.errors, status: :unprocessable_entity
    end
  end

  private

  def set_recomendacoes_agricola
    @recomendacoes_agricola = RecomendacoesAgricola.find(params.expect(:id))
  end

  def recomendacoes_agricola_params
    params.expect(recomendacoes_agricola: [:analises_solo_id, :area_aplic, :atividade_gleba_id, :atividade_safra_id, :ativo, :data_recomendacao, :operador_id, :recomendante_id, :status, :deleted_at])
  end
end
