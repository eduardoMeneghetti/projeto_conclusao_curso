class CidadesController < ApplicationController

  def sync_cidades
    cidades = params[:cidades]
    resultado = []

    cidades.each do |cidade|
      existing = Cidade.find_by(codigo_ibge: cidade[:codigo_ibge])

      if existing
        resultado << { id: existing.id, local_id: cidade[:id] }
      else
        novo = Cidade.create(
          descricao: cidade[:descricao],
          codigo_ibge: cidade[:codigo_ibge],
          latitude: cidade[:latitude],
          longitude: cidade[:longitude], 
          estado_id: cidade[:estado_id]
        )
        resultado << { id: novo.id, local_id: cidade[:id] }
      end
    end

    render json: { message: 'Cidades sincronizadas', cidades: resultado }, status: :ok
  end

  def index
    if params[:updated_after]
      @cidades = Cidade.where('updated_at > ?', params[:updated_after])  
    else
      @cidades = Cidade.all  
    end
    render json: @cidades
  end

  private

  def set_cidade
    @cidade = Cidade.find(params.expect(:id))
  end

  def cidade_params
    params.expect(cidade: [:descricao, :codigo_ibge, :latitude, :longitude, :estado_id])
  end
end