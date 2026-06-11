class AnalisesSoloResultadosController < ApplicationController
  before_action :set_analises_solo_resultado, only: [:update]

  def index
    if params[:updated_after]
      @analises_solo_resultados = AnalisesSoloResultado.where('updated_at > ?', params[:updated_after])
    else
      @analises_solo_resultados = AnalisesSoloResultado.all
    end
    render json: @analises_solo_resultados
  end

  def sync_analises_solo_resultados
    analises_solo_resultados = params[:analises_solo_resultados]
    resultado = []

    analises_solo_resultados.each do |item|
      existing = AnalisesSoloResultado.find_by(id: item[:server_id])

      if existing
        existing.update(
          analises_solo_id: item[:analises_solo_id],
          parametro_medido: item[:parametro_medido],
          parametro_medido_id: item[:parametro_medido_id],
          valor: item[:valor]
        )
        resultado << { id: existing.id, local_id: item[:id] }
      else
        novo = AnalisesSoloResultado.create(
          analises_solo_id: item[:analises_solo_id],
          parametro_medido: item[:parametro_medido],
          parametro_medido_id: item[:parametro_medido_id],
          valor: item[:valor]
        )
        resultado << { id: novo.id, local_id: item[:id] }
      end
    end
    render json: { message: 'Análises solo resultados sincronizados', analises_solo_resultados: resultado }, status: :ok
  end

  def update
    if @analises_solo_resultado.update(analises_solo_resultado_params)
      render json: @analises_solo_resultado, status: :ok
    else
      render json: @analises_solo_resultado.errors, status: :unprocessable_entity
    end
  end

  private

  def set_analises_solo_resultado
    @analises_solo_resultado = AnalisesSoloResultado.find(params.expect(:id))
  end

  def analises_solo_resultado_params
    params.expect(analises_solo_resultado: [:analises_solo_id, :parametro_medido, :parametro_medido_id, :valor])
  end
end
