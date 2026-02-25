json.extract! usuario, :id, :nome, :usuario, :senha, :email, :operador, :created_at, :updated_at
json.url usuario_url(usuario, format: :json)
