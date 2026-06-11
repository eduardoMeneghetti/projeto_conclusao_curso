class RecomendacoesAgricolasItensController < ApplicationController
  before_action :set_recomendacoes_agricolas_iten, only: [:update]

  def index
    if params[:updated_after]
      @recomendacoes_agricolas_itens = RecomendacoesAgricolasIten.where('updated_at > ?', params[:updated_after])
    else
      @recomendacoes_agricolas_itens = RecomendacoesAgricolasIten.all
    end
    render json: @recomendacoes_agricolas_itens
  end

  def sync_recomendacoes_agricolas_itens
    recomendacoes_agricolas_itens = params[:recomendacoes_agricolas_itens]
    resultado = []

    recomendacoes_agricolas_itens.each do |item|
      existing = RecomendacoesAgricolasIten.find_by(id: item[:server_id])

      insumo = Insumo.find_by(id: item[:insumo_id])
      principios_ativo_id = item[:principios_ativo_id] || insumo&.principios_ativos_id

      campos = {
        recomendacao_agricola_id: item[:recomendacao_agricola_id],
        principios_ativo_id:      principios_ativo_id,
        insumo_id:                item[:insumo_id],
        dose:                     item[:dose],
        quantidade:               item[:quantidade],
        deleted_at:               item[:deleted_at]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = RecomendacoesAgricolasIten.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Recomendações agrícolas itens sincronizados', recomendacoes_agricolas_itens: resultado }, status: :ok
  end

  def update
    if @recomendacoes_agricolas_iten.update(recomendacoes_agricolas_iten_params)
      render json: @recomendacoes_agricolas_iten, status: :ok
    else
      render json: @recomendacoes_agricolas_iten.errors, status: :unprocessable_entity
    end
  end

  private

  def set_recomendacoes_agricolas_iten
    @recomendacoes_agricolas_iten = RecomendacoesAgricolasIten.find(params.expect(:id))
  end

  def recomendacoes_agricolas_iten_params
    params.expect(recomendacoes_agricolas_iten: [:recomendacao_agricola_id, :principios_ativo_id, :insumo_id, :dose, :quantidade, :deleted_at])
  end
end
