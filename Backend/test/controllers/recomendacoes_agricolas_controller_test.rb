require "test_helper"

class RecomendacoesAgricolasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @recomendacoes_agricola = recomendacoes_agricolas(:one)
  end

  test "should get index" do
    get recomendacoes_agricolas_url
    assert_response :success
  end

  test "should get new" do
    get new_recomendacoes_agricola_url
    assert_response :success
  end

  test "should create recomendacoes_agricola" do
    assert_difference("RecomendacoesAgricola.count") do
      post recomendacoes_agricolas_url, params: { recomendacoes_agricola: { analises_solo_id: @recomendacoes_agricola.analises_solo_id, atividade_gleba_id: @recomendacoes_agricola.atividade_gleba_id, atividade_id: @recomendacoes_agricola.atividade_id, atividade_safra_id: @recomendacoes_agricola.atividade_safra_id, data_recomendacao: @recomendacoes_agricola.data_recomendacao, operador: @recomendacoes_agricola.operador, propriedade_id: @recomendacoes_agricola.propriedade_id, recomendante: @recomendacoes_agricola.recomendante, safra_id: @recomendacoes_agricola.safra_id } }
    end

    assert_redirected_to recomendacoes_agricola_url(RecomendacoesAgricola.last)
  end

  test "should show recomendacoes_agricola" do
    get recomendacoes_agricola_url(@recomendacoes_agricola)
    assert_response :success
  end

  test "should get edit" do
    get edit_recomendacoes_agricola_url(@recomendacoes_agricola)
    assert_response :success
  end

  test "should update recomendacoes_agricola" do
    patch recomendacoes_agricola_url(@recomendacoes_agricola), params: { recomendacoes_agricola: { analises_solo_id: @recomendacoes_agricola.analises_solo_id, atividade_gleba_id: @recomendacoes_agricola.atividade_gleba_id, atividade_id: @recomendacoes_agricola.atividade_id, atividade_safra_id: @recomendacoes_agricola.atividade_safra_id, data_recomendacao: @recomendacoes_agricola.data_recomendacao, operador: @recomendacoes_agricola.operador, propriedade_id: @recomendacoes_agricola.propriedade_id, recomendante: @recomendacoes_agricola.recomendante, safra_id: @recomendacoes_agricola.safra_id } }
    assert_redirected_to recomendacoes_agricola_url(@recomendacoes_agricola)
  end

  test "should destroy recomendacoes_agricola" do
    assert_difference("RecomendacoesAgricola.count", -1) do
      delete recomendacoes_agricola_url(@recomendacoes_agricola)
    end

    assert_redirected_to recomendacoes_agricolas_url
  end
end
