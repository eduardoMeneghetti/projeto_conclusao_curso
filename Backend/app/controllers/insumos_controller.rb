class InsumosController < ApplicationController
  before_action :set_insumo, only: [:update]

  def index
    if params[:updated_after]
      @insumos = Insumo.where('updated_at > ?', params[:updated_after])
    else
      @insumos = Insumo.all
    end
    render json: @insumos
  end

  def sync_insumos
    insumos = params[:insumos]
    resultado = []

    insumos.each do |insumo|
      existing = Insumo.find_by(id: insumo[:server_id])

      if existing
        existing.update(
          descricao: insumo[:descricao],
          semente: insumo[:semente],
          ativo: insumo[:ativo],
          unidades_medida_id: insumo[:unidades_medida_id],
          principios_ativos_id: insumo[:principios_ativos_id]
        )
        resultado << { id: existing.id, local_id: insumo[:id] }
      else
        novo = Insumo.create(
          descricao: insumo[:descricao],
          semente: insumo[:semente],
          ativo: insumo[:ativo],
          unidades_medida_id: insumo[:unidades_medida_id],
          principios_ativos_id: insumo[:principios_ativos_id]
        )
        resultado << { id: novo.id, local_id: insumo[:id] }
      end
    end
    render json: { message: 'Insumos sincronizados', insumos: resultado }, status: :ok
  end

  def update
    if @insumo.update(insumo_params)
      render json: @insumo, status: :ok
    else
      render json: @insumo.errors, status: :unprocessable_entity
    end
  end

  private

  def set_insumo
    @insumo = Insumo.find(params.expect(:id))
  end

  def insumo_params
    params.expect(insumo: [:descricao, :semente, :ativo, :unidades_medida_id, :principios_ativos_id])
  end
end
