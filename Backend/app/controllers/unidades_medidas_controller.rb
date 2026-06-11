class UnidadesMedidasController < ApplicationController
  before_action :set_unidades_medida, only: [:update]

  def index
    if params[:updated_after]
      @unidades_medidas = UnidadesMedida.where('updated_at > ?', params[:updated_after])
    else
      @unidades_medidas = UnidadesMedida.all
    end
    render json: @unidades_medidas
  end

  def sync_unidades_medidas
    unidades_medidas = params[:unidades_medidas]
    resultado = []

    unidades_medidas.each do |unidade|
      existing = UnidadesMedida.find_by(id: unidade[:server_id])
      existing ||= UnidadesMedida.find_by(sigla: unidade[:sigla])

      campos = { descricao: unidade[:descricao], sigla: unidade[:sigla], ativo: unidade[:ativo] }

      if existing
        existing.update(campos)
        resultado << { id: existing.id, local_id: unidade[:id] }
      else
        novo = UnidadesMedida.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: unidade[:id] }
        else
          resultado << { id: nil, local_id: unidade[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Unidades de medidas sincronizadas', unidades_medidas: resultado }, status: :ok
  end

  def update
    if @unidades_medida.update(unidades_medida_params)
      render json: @unidades_medida, status: :ok
    else
      render json: @unidades_medida.errors, status: :unprocessable_entity
    end
  end

  private

  def set_unidades_medida
    @unidades_medida = UnidadesMedida.find(params.expect(:id))
  end

  def unidades_medida_params
    params.expect(unidades_medida: [:descricao, :sigla, :ativo])
  end
end
