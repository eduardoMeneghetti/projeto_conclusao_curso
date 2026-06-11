class PrincipiosAtivosController < ApplicationController
  before_action :set_principios_ativo, only: [:update]

  def index
    if params[:updated_after]
      @principios_ativos = PrincipiosAtivo.where('updated_at > ?', params[:updated_after])
    else
      @principios_ativos = PrincipiosAtivo.all
    end
    render json: @principios_ativos
  end

  def sync_principios_ativos
    principios_ativos = params[:principios_ativos]
    resultado = []

    principios_ativos.each do |principio|
      existing = PrincipiosAtivo.find_by(id: principio[:server_id])
      existing ||= PrincipiosAtivo.find_by(descricao: principio[:descricao])

      campos = { descricao: principio[:descricao], ativo: principio[:ativo] }

      if existing
        existing.update(campos)
        resultado << { id: existing.id, local_id: principio[:id] }
      else
        novo = PrincipiosAtivo.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: principio[:id] }
        else
          resultado << { id: nil, local_id: principio[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Princípios ativos sincronizados', principios_ativos: resultado }, status: :ok
  end

  def update
    if @principios_ativo.update(principios_ativo_params)
      render json: @principios_ativo, status: :ok
    else
      render json: @principios_ativo.errors, status: :unprocessable_entity
    end
  end

  private

  def set_principios_ativo
    @principios_ativo = PrincipiosAtivo.find(params.expect(:id))
  end

  def principios_ativo_params
    # mobile envia 'principio_ativo' (sem s), Rails usa 'principios_ativo'
    data = params[:principios_ativo].presence || params[:principio_ativo]
    data.permit(:descricao, :ativo)
  end
end
