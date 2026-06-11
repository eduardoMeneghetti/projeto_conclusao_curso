class AplicacoesItensInsumosController < ApplicationController
  before_action :set_aplicacoes_itens_insumo, only: [:update]

  def index
    if params[:updated_after]
      @aplicacoes_itens_insumos = AplicacoesItensInsumo.where('updated_at > ?', params[:updated_after])
    else
      @aplicacoes_itens_insumos = AplicacoesItensInsumo.all
    end
    render json: @aplicacoes_itens_insumos
  end

  def sync_aplicacoes_itens_insumos
    aplicacoes_itens_insumos = params[:aplicacoes_itens_insumos]
    resultado = []

    aplicacoes_itens_insumos.each do |item|
      existing = AplicacoesItensInsumo.find_by(id: item[:server_id])

      insumo = Insumo.find_by(id: item[:insumo_id])
      principios_ativo_id = item[:principios_ativo_id] || insumo&.principios_ativos_id

      campos = {
        aplicacoes_insumo_id: item[:aplicacoes_insumo_id],
        principios_ativo_id: principios_ativo_id,
        insumo_id:           item[:insumo_id],
        quantidade_aplic:    item[:quantidade_aplic],
        dose_aplic:          item[:dose_aplic],
        deleted_at:          item[:deleted_at]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = AplicacoesItensInsumo.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Aplicações itens insumos sincronizados', aplicacoes_itens_insumos: resultado }, status: :ok
  end

  def update
    if @aplicacoes_itens_insumo.update(aplicacoes_itens_insumo_params)
      render json: @aplicacoes_itens_insumo, status: :ok
    else
      render json: @aplicacoes_itens_insumo.errors, status: :unprocessable_entity
    end
  end

  private

  def set_aplicacoes_itens_insumo
    @aplicacoes_itens_insumo = AplicacoesItensInsumo.find(params.expect(:id))
  end

  def aplicacoes_itens_insumo_params
    params.expect(aplicacoes_itens_insumo: [:aplicacoes_insumo_id, :principios_ativo_id, :insumo_id, :quantidade_aplic, :dose_aplic, :deleted_at])
  end
end
