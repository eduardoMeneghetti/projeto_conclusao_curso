Rails.application.routes.draw do
  # rotas públicas de autenticação
  post '/auth/sync_usuarios', to: 'auth#sync_usuarios'
  post '/auth/login', to: 'auth#login'
  post '/propriedades/sync', to: 'propriedades#sync_propriedades'
  post '/estados/sync', to: 'estados#sync_estados'
  post '/cidades/sync', to: 'cidades#sync_cidades'
  post '/safras/sync', to: 'safras#sync_safras'
  post '/atividades/sync', to: 'atividades#sync_atividades'
  post '/atividade_safras/sync', to: 'atividade_safras#sync_atividade_safras'
  post '/glebas/sync', to: 'glebas#sync_glebas'
  post '/gleba_pontos/sync', to: 'gleba_pontos#sync_gleba_pontos'
  post '/atividade_glebas/sync', to: 'atividade_glebas#sync_atividade_glebas'


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