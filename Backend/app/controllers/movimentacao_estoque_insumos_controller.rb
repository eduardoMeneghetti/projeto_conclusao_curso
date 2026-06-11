class MovimentacaoEstoqueInsumosController < ApplicationController
  before_action :set_movimentacao_estoque_insumo, only: [:update]

  def index
    if params[:updated_after]
      @movimentacao_estoque_insumos = MovimentacaoEstoqueInsumo.where('updated_at > ?', params[:updated_after])
    else
      @movimentacao_estoque_insumos = MovimentacaoEstoqueInsumo.all
    end
    render json: @movimentacao_estoque_insumos
  end

  def sync_movimentacao_estoque_insumos
    movimentacao_estoque_insumos = params[:movimentacao_estoque_insumos]
    resultado = []

    movimentacao_estoque_insumos.each do |item|
      existing = MovimentacaoEstoqueInsumo.find_by(id: item[:server_id])

      campos = {
        ajuste_estoque_id:    item[:ajuste_estoque_id],
        aplicacoes_insumo_id: item[:aplicacoes_insumo_id],
        insumo_id:            item[:insumo_id],
        quantidade:           item[:quantidade],
        valor_unitario:       item[:valor_unitario],
        origem:               item[:origem],
        deleted_at:           item[:deleted_at]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = MovimentacaoEstoqueInsumo.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Movimentações de estoque sincronizadas', movimentacao_estoque_insumos: resultado }, status: :ok
  end

  def update
    if @movimentacao_estoque_insumo.update(movimentacao_estoque_insumo_params)
      render json: @movimentacao_estoque_insumo, status: :ok
    else
      render json: @movimentacao_estoque_insumo.errors, status: :unprocessable_entity
    end
  end

  private

  def set_movimentacao_estoque_insumo
    @movimentacao_estoque_insumo = MovimentacaoEstoqueInsumo.find(params.expect(:id))
  end

  def movimentacao_estoque_insumo_params
    params.expect(movimentacao_estoque_insumo: [:ajuste_estoque_id, :aplicacoes_insumo_id, :insumo_id, :quantidade, :valor_unitario, :origem, :deleted_at])
  end
end
