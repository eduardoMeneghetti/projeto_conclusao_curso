class ParametrosMetricasController < ApplicationController
  before_action :set_parametros_metrica, only: [:update]

  def index
    if params[:updated_after]
      @parametros_metricas = ParametrosMetrica.where('updated_at > ?', params[:updated_after])
    else
      @parametros_metricas = ParametrosMetrica.all
    end
    render json: @parametros_metricas
  end

  def sync_parametros_metricas
    parametros_metricas = params[:parametros_metricas]
    resultado = []

    parametros_metricas.each do |parametro|
      existing = ParametrosMetrica.find_by(id: parametro[:server_id])
      existing ||= ParametrosMetrica.find_by(descricao: parametro[:descricao])
      tipo_valor = parametro[:tipo]&.to_s&.first

      campos = { tipo: tipo_valor, descricao: parametro[:descricao] }

      if existing
        existing.update(campos)
        resultado << { id: existing.id, local_id: parametro[:id] }
      else
        novo = ParametrosMetrica.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: parametro[:id] }
        else
          resultado << { id: nil, local_id: parametro[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Parâmetros métricas sincronizados', parametros_metricas: resultado }, status: :ok
  end

  def update
    if @parametros_metrica.update(parametros_metrica_params)
      render json: @parametros_metrica, status: :ok
    else
      render json: @parametros_metrica.errors, status: :unprocessable_entity
    end
  end

  private

  def set_parametros_metrica
    @parametros_metrica = ParametrosMetrica.find(params.expect(:id))
  end

  def parametros_metrica_params
    params.expect(parametros_metrica: [:tipo, :descricao])
  end
end
