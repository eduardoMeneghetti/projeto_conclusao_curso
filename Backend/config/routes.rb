Rails.application.routes.draw do
  # rotas públicas de autenticação
  post '/auth/sync_usuarios', to: 'auth#sync_usuarios'
  post '/auth/login', to: 'auth#login'

  # rotas de sincronização
  post '/propriedades/sync',                    to: 'propriedades#sync_propriedades'
  post '/estados/sync',                         to: 'estados#sync_estados'
  post '/cidades/sync',                         to: 'cidades#sync_cidades'
  post '/safras/sync',                          to: 'safras#sync_safras'
  post '/nutrientes/sync',                      to: 'nutrientes#sync_nutrientes'
  post '/parametros_metricas/sync',             to: 'parametros_metricas#sync_parametros_metricas'
  post '/principios_ativos/sync',               to: 'principios_ativos#sync_principios_ativos'
  post '/unidades_medidas/sync',                to: 'unidades_medidas#sync_unidades_medidas'
  post '/maquinas/sync',                        to: 'maquinas#sync_maquinas'
  post '/principios_ativos_nutrientes/sync',    to: 'principios_ativos_nutrientes#sync_principios_ativos_nutrientes'
  post '/fichamentos/sync',                     to: 'fichamentos#sync_fichamentos'
  post '/insumos/sync',                         to: 'insumos#sync_insumos'
  post '/atividades/sync',                      to: 'atividades#sync_atividades'
  post '/atividade_safras/sync',                to: 'atividade_safras#sync_atividade_safras'
  post '/glebas/sync',                          to: 'glebas#sync_glebas'
  post '/gleba_pontos/sync',                    to: 'gleba_pontos#sync_gleba_pontos'
  post '/atividade_glebas/sync',                to: 'atividade_glebas#sync_atividade_glebas'
  post '/ajuste_estoques/sync',                 to: 'ajuste_estoques#sync_ajuste_estoques'
  post '/analises_solos/sync',                  to: 'analises_solos#sync_analises_solos'
  post '/analises_solo_resultados/sync',        to: 'analises_solo_resultados#sync_analises_solo_resultados'
  post '/recomendacoes_agricolas/sync',         to: 'recomendacoes_agricolas#sync_recomendacoes_agricolas'
  post '/recomendacoes_agricolas_itens/sync',   to: 'recomendacoes_agricolas_itens#sync_recomendacoes_agricolas_itens'
  post '/aplicacoes_insumos/sync',              to: 'aplicaoes_insumos#sync_aplicacoes_insumos'
  post '/aplicacoes_itens_insumos/sync',        to: 'aplicacoes_itens_insumos#sync_aplicacoes_itens_insumos'
  post '/movimentacao_estoque_insumos/sync',    to: 'movimentacao_estoque_insumos#sync_movimentacao_estoque_insumos'

  # recursos REST
  resources :aplicacoes_itens_insumos
  resources :analises_solo_resultados
  resources :aplicacoes_insumos, controller: 'aplicaoes_insumos'
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
  resources :maquinas
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

  get "up" => "rails/health#show", as: :rails_health_check
end
