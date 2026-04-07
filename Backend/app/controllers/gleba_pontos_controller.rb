class GlebaPontosController < ApplicationController
  before_action :set_gleba_ponto, only: [  :update ]

  def index
    if params[:updated_after]
      @gleba_pontos = GlebaPonto.where('updated_at > ?', params[:updated_after])
    else
      @gleba_pontos = GlebaPonto.all  
    end
    render json: @gleba_pontos
  end

  def update
    if @gleba_ponto.update(gleba_ponto_params)
      render json: @gleba_ponto, status: :ok
    else
      render json: @gleba_ponto.errors, status: :unprocessable_entity
    end
  end 

  def sync_gleba_pontos
    gleba_pontos = params[:gleba_pontos]
    resultado = [] 

    gleba_pontos.each do |gleba_ponto|
      existing = GlebaPonto.find_by(id: gleba_ponto[:server_id]) 
      
      if existing
        existing.update(
          latitude: gleba_ponto[:latitude],
          longitude: gleba_ponto[:longitude],
          ordem: gleba_ponto[:ordem],     
          gleba_id: gleba_ponto[:gleba_id],
        )
        resultado << { id: existing.id, local_id: gleba_ponto[:id] }
      else
        novo = GlebaPonto.create(
          latitude: gleba_ponto[:latitude],
          longitude: gleba_ponto[:longitude],
          ordem: gleba_ponto[:ordem],
          gleba_id: gleba_ponto[:gleba_id],
        )
        resultado << { id: novo.id, local_id: gleba_ponto[:id] }
      end
    end
    render json: { message: 'GlebaPontos sincronizados', gleba_pontos: resultado }, status: :ok
  end

  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gleba_ponto
      @gleba_ponto = GlebaPonto.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def gleba_ponto_params
      params.expect(gleba_ponto: [ :latitude, :longitude, :ordem, :gleba_id ])
    end
end
