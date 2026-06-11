class FichamentosController < ApplicationController
  before_action :set_fichamento, only: [:update]

  def index
    if params[:updated_after]
      @fichamentos = Fichamento.where('updated_at > ?', params[:updated_after])
    else
      @fichamentos = Fichamento.all
    end
    render json: @fichamentos
  end

  def sync_fichamentos
    fichamentos = params[:fichamentos]
    resultado = []

    fichamentos.each do |fichamento|
      existing = Fichamento.find_by(id: fichamento[:server_id])
      existing ||= Fichamento.find_by(
        classificacao: fichamento[:classificacao],
        valor_min: fichamento[:valor_min],
        valor_max: fichamento[:valor_max]
      )

      campos = {
        parametros_metrica_id: fichamento[:parametros_metrica_id],
        classificacao: fichamento[:classificacao],
        valor_min: fichamento[:valor_min],
        valor_max: fichamento[:valor_max]
      }

      if existing
        existing.update(campos)
        resultado << { id: existing.id, local_id: fichamento[:id] }
      else
        novo = Fichamento.new(campos)
        if novo.save
          resultado << { id: novo.id, local_id: fichamento[:id] }
        else
          resultado << { id: nil, local_id: fichamento[:id], errors: novo.errors.full_messages }
        end
      end
    end
    render json: { message: 'Fichamentos sincronizados', fichamentos: resultado }, status: :ok
  end

  def update
    if @fichamento.update(fichamento_params)
      render json: @fichamento, status: :ok
    else
      render json: @fichamento.errors, status: :unprocessable_entity
    end
  end

  private

  def set_fichamento
    @fichamento = Fichamento.find(params.expect(:id))
  end

  def fichamento_params
    params.expect(fichamento: [:parametros_metrica_id, :classificacao, :valor_min, :valor_max])
  end
end
