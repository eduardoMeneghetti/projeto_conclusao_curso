class PropriedadesController < ApplicationController
  before_action :set_propriedade, only: [:update] 

  def sync_propriedades 
    propriedades = params[:propriedades]
    resultado = []

    propriedades.each do |propriedade|
      existing = Propriedade.find_by(id: propriedade[:server_id])

      if existing
        existing.update(
          descricao: propriedade[:descricao],
          hectare: propriedade[:hectare],
          cidade_id: propriedade[:cidade_id],
          ativo: propriedade[:ativo]
        )
        resultado << { id: existing.id, local_id: propriedade[:id] }
      else
        novo = Propriedade.create(
          descricao: propriedade[:descricao],
          hectare: propriedade[:hectare],
          cidade_id: propriedade[:cidade_id],
          ativo: propriedade[:ativo]
        )
        resultado << { id: novo.id, local_id: propriedade[:id] }
      end
    end

    render json: { message: 'Propriedades sincronizadas', propriedades: resultado }, status: :ok
  end

  def update  
    if @propriedade.update(propriedade_params)
      render json: @propriedade, status: :ok
    else
      render json: @propriedade.errors, status: :unprocessable_entity
    end
  end

  def index
    if params[:updated_after]
      @propriedades = Propriedade.where('updated_at > ?', params[:updated_after])
    else
      @propriedades = Propriedade.all
    end
      render json: @propriedades
  end


 private

  def set_propriedade
    @propriedade = Propriedade.find(params.expect(:id))
  end

  def propriedade_params
    params.expect(propriedade: [:descricao, :hectare, :cidade_id, :ativo])
  end
end