class AjusteEstoquesController < ApplicationController
  before_action :set_ajuste_estoque, only: [:update]

  def index
    if params[:updated_after]
      @ajuste_estoques = AjusteEstoque.where('updated_at > ?', params[:updated_after])
    else
      @ajuste_estoques = AjusteEstoque.all
    end
    render json: @ajuste_estoques
  end

  def sync_ajuste_estoques
    ajuste_estoques = params[:ajuste_estoques]
    resultado = []

    ajuste_estoques.each do |item|
      existing = AjusteEstoque.find_by(id: item[:server_id])

      campos = {
        usuario_id:    item[:usuario_id],
        propriedade_id: item[:propriedade_id],
        observacao:    item[:observacao],
        data:          item[:data],
        entrada_saida: item[:entrada_saida]&.to_s&.first,
        deleted_at:    item[:deleted_at]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = AjusteEstoque.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Ajustes de estoque sincronizados', ajuste_estoques: resultado }, status: :ok
  end

  def update
    if @ajuste_estoque.update(ajuste_estoque_params)
      render json: @ajuste_estoque, status: :ok
    else
      render json: @ajuste_estoque.errors, status: :unprocessable_entity
    end
  end

  private

  def set_ajuste_estoque
    @ajuste_estoque = AjusteEstoque.find(params.expect(:id))
  end

  def ajuste_estoque_params
    params.expect(ajuste_estoque: [:usuario_id, :propriedade_id, :observacao, :data, :entrada_saida, :deleted_at])
  end
end
