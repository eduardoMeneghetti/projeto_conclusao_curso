class PrincipiosAtivosNutrientesController < ApplicationController
  before_action :set_principios_ativos_nutriente, only: [:update]

  def index
    if params[:updated_after]
      @principios_ativos_nutrientes = PrincipiosAtivosNutriente.where('updated_at > ?', params[:updated_after])
    else
      @principios_ativos_nutrientes = PrincipiosAtivosNutriente.all
    end
    render json: @principios_ativos_nutrientes
  end

  def sync_principios_ativos_nutrientes
    principios_ativos_nutrientes = params[:principios_ativos_nutrientes]
    resultado = []

    principios_ativos_nutrientes.each do |item|
      existing = PrincipiosAtivosNutriente.find_by(id: item[:server_id])
      existing ||= PrincipiosAtivosNutriente.find_by(
        principios_ativo_id: item[:principios_ativo_id],
        nutriente_id: item[:nutriente_id]
      )

      campos = {
        principios_ativo_id: item[:principios_ativo_id],
        nutriente_id:        item[:nutriente_id],
        percentual:          item[:percentual]
      }

      if existing
        if existing.update(campos)
          resultado << { id: existing.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: existing.errors.full_messages }
        end
      else
        novo = PrincipiosAtivosNutriente.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: item[:id] }
        else
          resultado << { id: nil, local_id: item[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Princípios ativos nutrientes sincronizados', principios_ativos_nutrientes: resultado }, status: :ok
  end

  def update
    if @principios_ativos_nutriente.update(principios_ativos_nutriente_params)
      render json: @principios_ativos_nutriente, status: :ok
    else
      render json: @principios_ativos_nutriente.errors, status: :unprocessable_entity
    end
  end

  private

  def set_principios_ativos_nutriente
    @principios_ativos_nutriente = PrincipiosAtivosNutriente.find_by(id: params[:id])
    render json: { error: 'Registro não encontrado' }, status: :not_found unless @principios_ativos_nutriente
  end

  def principios_ativos_nutriente_params
    # mobile envia 'principio_ativo_nutriente', Rails usa 'principios_ativos_nutriente'
    data = params[:principios_ativos_nutriente].presence || params[:principio_ativo_nutriente]
    data.permit(:principios_ativo_id, :nutriente_id, :percentual)
  end
end
