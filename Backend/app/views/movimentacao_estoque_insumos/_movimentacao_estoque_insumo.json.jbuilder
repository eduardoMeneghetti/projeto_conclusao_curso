json.extract! movimentacao_estoque_insumo, :id, :quantidade, :valor_unitario, :ajuste_estoque_id, :insumo_id, :created_at, :updated_at
json.url movimentacao_estoque_insumo_url(movimentacao_estoque_insumo, format: :json)
