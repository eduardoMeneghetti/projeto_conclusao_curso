require "test_helper"

class ParametrosMetricasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @parametros_metrica = parametros_metricas(:one)
  end

  test "should get index" do
    get parametros_metricas_url
    assert_response :success
  end

  test "should get new" do
    get new_parametros_metrica_url
    assert_response :success
  end

  test "should create parametros_metrica" do
    assert_difference("ParametrosMetrica.count") do
      post parametros_metricas_url, params: { parametros_metrica: { descricao: @parametros_metrica.descricao, tipo: @parametros_metrica.tipo } }
    end

    assert_redirected_to parametros_metrica_url(ParametrosMetrica.last)
  end

  test "should show parametros_metrica" do
    get parametros_metrica_url(@parametros_metrica)
    assert_response :success
  end

  test "should get edit" do
    get edit_parametros_metrica_url(@parametros_metrica)
    assert_response :success
  end

  test "should update parametros_metrica" do
    patch parametros_metrica_url(@parametros_metrica), params: { parametros_metrica: { descricao: @parametros_metrica.descricao, tipo: @parametros_metrica.tipo } }
    assert_redirected_to parametros_metrica_url(@parametros_metrica)
  end

  test "should destroy parametros_metrica" do
    assert_difference("ParametrosMetrica.count", -1) do
      delete parametros_metrica_url(@parametros_metrica)
    end

    assert_redirected_to parametros_metricas_url
  end
end
