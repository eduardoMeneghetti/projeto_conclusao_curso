json.extract! cidade, :id, :descricao, :codigo_ibge, :latitude, :longitude, :estado_id, :created_at, :updated_at
json.url cidade_url(cidade, format: :json)
