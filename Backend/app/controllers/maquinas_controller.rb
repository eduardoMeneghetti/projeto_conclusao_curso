class MaquinasController < ApplicationController
  before_action :set_maquina, only: [:update]

  def index
    if params[:updated_after]
      @maquinas = Maquina.where('updated_at > ?', params[:updated_after])
    else
      @maquinas = Maquina.all
    end
    render json: @maquinas
  end

  def sync_maquinas
    maquinas = params[:maquinas]
    resultado = []

    maquinas.each do |maquina|
      existing = Maquina.find_by(id: maquina[:server_id])

      if existing
        existing.update(
          descricao: maquina[:descricao],
          ativo: maquina[:ativo]
        )
        resultado << { id: existing.id, local_id: maquina[:id] }
      else
        novo = Maquina.create(
          descricao: maquina[:descricao],
          ativo: maquina[:ativo]
        )
        resultado << { id: novo.id, local_id: maquina[:id] }
      end
    end
    render json: { message: 'Máquinas sincronizadas', maquinas: resultado }, status: :ok
  end

  def update
    if @maquina.update(maquina_params)
      render json: @maquina, status: :ok
    else
      render json: @maquina.errors, status: :unprocessable_entity
    end
  end

  private

  def set_maquina
    @maquina = Maquina.find(params.expect(:id))
  end

  def maquina_params
    params.expect(maquina: [:descricao, :ativo])
  end
end
