Rails.application.routes.draw do
  # rotas públicas de autenticação
  post '/auth/sync_usuarios', to: 'auth#sync_usuarios'
  post '/auth/login', to: 'auth#login'

  # recursos
  resources :aplicacoes_itens_insumos
  resources :analises_solo_resultados
  resources :aplicaoes_insumos
  resources :recomendacoes_agricolas_itens
  resources :recomendacoes_agricolas
  resources :analises_solos
  resources :fichamentos
  resources :parametros_metricas
  resources :movimentacao_estoque_insumos
  resources :ajuste_estoques
  resources :insumos
  resources :unidades_medidas
  resources :principios_ativos_nutrientes
  resources :principios_ativos
  resources :nutrientes
  resources :atividade_glebas
  resources :atividade_safras
  resources :atividades
  resources :safras
  resources :gleba_pontos
  resources :glebas
  resources :usuarios
  resources :propriedades
  resources :cidades
  resources :estados
  resources :maquinas

  get "up" => "rails/health#show", as: :rails_health_check
end