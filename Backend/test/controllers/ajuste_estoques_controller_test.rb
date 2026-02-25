require "test_helper"

class AjusteEstoquesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @ajuste_estoque = ajuste_estoques(:one)
  end

  test "should get index" do
    get ajuste_estoques_url
    assert_response :success
  end

  test "should get new" do
    get new_ajuste_estoque_url
    assert_response :success
  end

  test "should create ajuste_estoque" do
    assert_difference("AjusteEstoque.count") do
      post ajuste_estoques_url, params: { ajuste_estoque: { data: @ajuste_estoque.data, entrada_saida: @ajuste_estoque.entrada_saida, observacao: @ajuste_estoque.observacao, propriedade_id: @ajuste_estoque.propriedade_id, usuario_id: @ajuste_estoque.usuario_id } }
    end

    assert_redirected_to ajuste_estoque_url(AjusteEstoque.last)
  end

  test "should show ajuste_estoque" do
    get ajuste_estoque_url(@ajuste_estoque)
    assert_response :success
  end

  test "should get edit" do
    get edit_ajuste_estoque_url(@ajuste_estoque)
    assert_response :success
  end

  test "should update ajuste_estoque" do
    patch ajuste_estoque_url(@ajuste_estoque), params: { ajuste_estoque: { data: @ajuste_estoque.data, entrada_saida: @ajuste_estoque.entrada_saida, observacao: @ajuste_estoque.observacao, propriedade_id: @ajuste_estoque.propriedade_id, usuario_id: @ajuste_estoque.usuario_id } }
    assert_redirected_to ajuste_estoque_url(@ajuste_estoque)
  end

  test "should destroy ajuste_estoque" do
    assert_difference("AjusteEstoque.count", -1) do
      delete ajuste_estoque_url(@ajuste_estoque)
    end

    assert_redirected_to ajuste_estoques_url
  end
end
