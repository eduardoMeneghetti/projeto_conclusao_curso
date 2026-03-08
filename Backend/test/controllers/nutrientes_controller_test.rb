require "test_helper"

class NutrientesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @nutriente = nutrientes(:one)
  end

  test "should get index" do
    get nutrientes_url
    assert_response :success
  end

  test "should get new" do
    get new_nutriente_url
    assert_response :success
  end

  test "should create nutriente" do
    assert_difference("Nutriente.count") do
      post nutrientes_url, params: { nutriente: { descricao: @nutriente.descricao, sigla: @nutriente.sigla, unidade: @nutriente.unidade } }
    end

    assert_redirected_to nutriente_url(Nutriente.last)
  end

  test "should show nutriente" do
    get nutriente_url(@nutriente)
    assert_response :success
  end

  test "should get edit" do
    get edit_nutriente_url(@nutriente)
    assert_response :success
  end

  test "should update nutriente" do
    patch nutriente_url(@nutriente), params: { nutriente: { descricao: @nutriente.descricao, sigla: @nutriente.sigla, unidade: @nutriente.unidade } }
    assert_redirected_to nutriente_url(@nutriente)
  end

  test "should destroy nutriente" do
    assert_difference("Nutriente.count", -1) do
      delete nutriente_url(@nutriente)
    end

    assert_redirected_to nutrientes_url
  end
end
