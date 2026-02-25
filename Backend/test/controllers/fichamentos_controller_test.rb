require "test_helper"

class FichamentosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @fichamento = fichamentos(:one)
  end

  test "should get index" do
    get fichamentos_url
    assert_response :success
  end

  test "should get new" do
    get new_fichamento_url
    assert_response :success
  end

  test "should create fichamento" do
    assert_difference("Fichamento.count") do
      post fichamentos_url, params: { fichamento: { classificacao: @fichamento.classificacao, parametro_metrica_id: @fichamento.parametro_metrica_id, valor_max: @fichamento.valor_max, valor_min: @fichamento.valor_min } }
    end

    assert_redirected_to fichamento_url(Fichamento.last)
  end

  test "should show fichamento" do
    get fichamento_url(@fichamento)
    assert_response :success
  end

  test "should get edit" do
    get edit_fichamento_url(@fichamento)
    assert_response :success
  end

  test "should update fichamento" do
    patch fichamento_url(@fichamento), params: { fichamento: { classificacao: @fichamento.classificacao, parametro_metrica_id: @fichamento.parametro_metrica_id, valor_max: @fichamento.valor_max, valor_min: @fichamento.valor_min } }
    assert_redirected_to fichamento_url(@fichamento)
  end

  test "should destroy fichamento" do
    assert_difference("Fichamento.count", -1) do
      delete fichamento_url(@fichamento)
    end

    assert_redirected_to fichamentos_url
  end
end
