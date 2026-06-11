class AplicaoesInsumosController < ApplicationController
  before_action :set_aplicacoes_insumo, only: [:update]

  def index
    if params[:updated_after]
      @aplicacoes_insumos = AplicaoesInsumo.where('updated_at > ?', params[:updated_after])
    else
      @aplicacoes_insumos = AplicaoesInsumo.all
    end
    render json: @aplicacoes_insumos
  end

  def sync_aplicacoes_insumos
    aplicacoes_insumos = params[:aplicacoes_insumos]
    resultado = []

    aplicacoes_insumos.each do |item|
      existing = AplicaoesInsumo.find_by(id: item[:server_id])

      atividade_safra = AtividadeSafra.find_by(id: item[:atividade_safra_id])
      atividade_id    = atividade_safra&.atividade_id
      propriedade_id  = atividade_safra&.propriedade_id
      usuario_id      = item[:usuario_id] || item[:operador_id]
      operador_id     = item[:operador_id] || item[:usuario_id]

      campos = {
        atividade_safra_id:       item[:atividade_safra_id],
        atividade_gleba_id:       item[:atividade_gleba_id],
        atividade_id:             atividade_id,
        propriedade_id:           propriedade_id,
        usuario_id:               usuario_id,
        operador_id:              operador_id,
        maquina_id:               item[:maquina_id],
        recomendacoes_agricolas_id: item[:recomendacoes_agricolas_id],
        area_aplic:               item[:area_aplic],
        data_inicio:              item[:data_inicio],
        data_final:               item[:data_final],
        ativo:                    item[:ativo],
        deleted_at:               item[:deleted_at]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = AplicaoesInsumo.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Aplicações de insumos sincronizadas', aplicacoes_insumos: resultado }, status: :ok
  end

  def update
    if @aplicacoes_insumo.update(aplicacoes_insumo_params)
      render json: @aplicacoes_insumo, status: :ok
    else
      render json: @aplicacoes_insumo.errors, status: :unprocessable_entity
    end
  end

  private

  def set_aplicacoes_insumo
    @aplicacoes_insumo = AplicaoesInsumo.find(params.expect(:id))
  end

  def aplicacoes_insumo_params
    data = params[:aplicacoes_insumo].presence ||
           params[:aplicaoes_insumo].presence ||
           params[:aplicacao_insumo]
    data.permit(:atividade_safra_id, :atividade_gleba_id, :atividade_id, :propriedade_id,
                :usuario_id, :operador_id, :maquina_id, :recomendacoes_agricolas_id,
                :area_aplic, :data_inicio, :data_final, :ativo, :deleted_at)
  end
end
