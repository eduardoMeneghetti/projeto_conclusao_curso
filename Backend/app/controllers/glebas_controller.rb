class GlebasController < ApplicationController
  before_action :set_gleba, only: [ :update  ]

  def index
    if params[:updated_after]
      @glebas = Gleba.where('updated_at > ?', params[:updated_after])
    else
      @glebas = Gleba.all  
    end
    render json: @glebas
  end

  def update
    if @gleba.update(gleba_params)
      render json: @gleba, status: :ok
    else
      render json: @gleba.errors, status: :unprocessable_entity
    end
  end

  def sync_glebas
    glebas = params[:glebas]
    resultado = []

    glebas.each do |gleba|
      existing = Gleba.find_by(id: gleba[:server_id])

    if existing
        existing.update(
          descricao: gleba[:descricao],
          ativo: gleba[:ativo],
          area_hectares: gleba[:area_hectares],
          propriedade_id: gleba[:propriedade_id]
        )
        resultado << { id: existing.id, local_id: gleba[:id] }
      else
        novo = Gleba.create(
          descricao: gleba[:descricao],
          ativo: gleba[:ativo],
          area_hectares: gleba[:area_hectares],
          propriedade_id: gleba[:propriedade_id]
        )
        resultado << { id: novo.id, local_id: gleba[:id] }
      end
    end 
    render json: { message: 'Glebas sincronizadas', glebas: resultado }, status: :ok  
  end
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gleba
      @gleba = Gleba.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def gleba_params
      params.expect(gleba: [ :descricao, :ativo, :area_hectares, :propriedade_id ])
    end
end
