class EstadosController < ApplicationController

  def sync_estados
    estados = params[:estados]
    resultado = []

    estados.each do |estado|
       
        existing = Estado.find_by(sigla: estado[:sigla]) || 
                   Estado.find_by(codigo_ibge: estado[:codigo_ibge])

        if existing
            resultado << { id: existing.id, local_id: estado[:id] }
        else
            novo = Estado.create(
                descricao: estado[:descricao],
                codigo_ibge: estado[:codigo_ibge],
                sigla: estado[:sigla]
            )
            resultado << { id: novo.id, local_id: estado[:id] }
        end
    end

    render json: { message: 'Estados sincronizados', estados: resultado }, status: :ok
end

def index
    if params[:updated_after]
        @estados = Estado.where('updated_at > ?', params[:updated_after])
    else
        @estados = Estado.all
    end
    render json: @estados
end


  private
    def set_estado
      @estado = Estado.find(params.expect(:id))
    end

    def estado_params
      params.expect(estado: [ :descricao, :codigo_ibge, :sigla ])
    end
end
