require "test_helper"

class AnalisesSoloResultadosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @analises_solo_resultado = analises_solo_resultados(:one)
  end

  test "should get index" do
    get analises_solo_resultados_url
    assert_response :success
  end

  test "should get new" do
    get new_analises_solo_resultado_url
    assert_response :success
  end

  test "should create analises_solo_resultado" do
    assert_difference("AnalisesSoloResultado.count") do
      post analises_solo_resultados_url, params: { analises_solo_resultado: { analises_solo_id: @analises_solo_resultado.analises_solo_id, parametro_medido: @analises_solo_resultado.parametro_medido, parametro_medido_id: @analises_solo_resultado.parametro_medido_id, valor: @analises_solo_resultado.valor } }
    end

    assert_redirected_to analises_solo_resultado_url(AnalisesSoloResultado.last)
  end

  test "should show analises_solo_resultado" do
    get analises_solo_resultado_url(@analises_solo_resultado)
    assert_response :success
  end

  test "should get edit" do
    get edit_analises_solo_resultado_url(@analises_solo_resultado)
    assert_response :success
  end

  test "should update analises_solo_resultado" do
    patch analises_solo_resultado_url(@analises_solo_resultado), params: { analises_solo_resultado: { analises_solo_id: @analises_solo_resultado.analises_solo_id, parametro_medido: @analises_solo_resultado.parametro_medido, parametro_medido_id: @analises_solo_resultado.parametro_medido_id, valor: @analises_solo_resultado.valor } }
    assert_redirected_to analises_solo_resultado_url(@analises_solo_resultado)
  end

  test "should destroy analises_solo_resultado" do
    assert_difference("AnalisesSoloResultado.count", -1) do
      delete analises_solo_resultado_url(@analises_solo_resultado)
    end

    assert_redirected_to analises_solo_resultados_url
  end
end
