Rails.application.routes.draw do
  resources :aplicacoes_itens_insumos
  resources :analises_solo_resultados
  resources :aplicaoes_insumos
  resources :recomendacoes_agricolas_itens
  resources :recomendacoes_agricolas
  resources :analises_solos
  resources :alises_solos
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
  resources :talhos
  resources :usuarios
  resources :propriedades
  resources :cidades
  resources :estados
  resources :maquinas
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
