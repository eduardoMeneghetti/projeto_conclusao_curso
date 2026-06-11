class NutrientesController < ApplicationController
  before_action :set_nutriente, only: [:update]

  def index
    if params[:updated_after]
      @nutrientes = Nutriente.where('updated_at > ?', params[:updated_after])
    else
      @nutrientes = Nutriente.all
    end
    render json: @nutrientes
  end

  def sync_nutrientes
    nutrientes = params[:nutrientes]
    resultado = []

    nutrientes.each do |nutriente|
      existing = Nutriente.find_by(id: nutriente[:server_id])
      existing ||= Nutriente.find_by(sigla: nutriente[:sigla])

      campos = { descricao: nutriente[:descricao], sigla: nutriente[:sigla], unidade: nutriente[:unidade] }

      if existing
        existing.update(campos)
        resultado << { id: existing.id, local_id: nutriente[:id] }
      else
        novo = Nutriente.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: nutriente[:id] }
        else
          resultado << { id: nil, local_id: nutriente[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Nutrientes sincronizados', nutrientes: resultado }, status: :ok
  end

  def update
    if @nutriente.update(nutriente_params)
      render json: @nutriente, status: :ok
    else
      render json: @nutriente.errors, status: :unprocessable_entity
    end
  end

  private

  def set_nutriente
    @nutriente = Nutriente.find(params.expect(:id))
  end

  def nutriente_params
    params.expect(nutriente: [:descricao, :sigla, :unidade])
  end
end
