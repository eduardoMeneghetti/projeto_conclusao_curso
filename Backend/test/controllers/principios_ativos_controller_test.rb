require "test_helper"

class PrincipiosAtivosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @principios_ativo = principios_ativos(:one)
  end

  test "should get index" do
    get principios_ativos_url
    assert_response :success
  end

  test "should get new" do
    get new_principios_ativo_url
    assert_response :success
  end

  test "should create principios_ativo" do
    assert_difference("PrincipiosAtivo.count") do
      post principios_ativos_url, params: { principios_ativo: { ativo: @principios_ativo.ativo, descricao: @principios_ativo.descricao } }
    end

    assert_redirected_to principios_ativo_url(PrincipiosAtivo.last)
  end

  test "should show principios_ativo" do
    get principios_ativo_url(@principios_ativo)
    assert_response :success
  end

  test "should get edit" do
    get edit_principios_ativo_url(@principios_ativo)
    assert_response :success
  end

  test "should update principios_ativo" do
    patch principios_ativo_url(@principios_ativo), params: { principios_ativo: { ativo: @principios_ativo.ativo, descricao: @principios_ativo.descricao } }
    assert_redirected_to principios_ativo_url(@principios_ativo)
  end

  test "should destroy principios_ativo" do
    assert_difference("PrincipiosAtivo.count", -1) do
      delete principios_ativo_url(@principios_ativo)
    end

    assert_redirected_to principios_ativos_url
  end
end
