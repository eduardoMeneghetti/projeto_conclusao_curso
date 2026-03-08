require "test_helper"

class PrincipiosAtivosNutrientesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @principios_ativos_nutriente = principios_ativos_nutrientes(:one)
  end

  test "should get index" do
    get principios_ativos_nutrientes_url
    assert_response :success
  end

  test "should get new" do
    get new_principios_ativos_nutriente_url
    assert_response :success
  end

  test "should create principios_ativos_nutriente" do
    assert_difference("PrincipiosAtivosNutriente.count") do
      post principios_ativos_nutrientes_url, params: { principios_ativos_nutriente: { nutriente_id: @principios_ativos_nutriente.nutriente_id, percentual: @principios_ativos_nutriente.percentual, principio_ativos_id: @principios_ativos_nutriente.principio_ativos_id } }
    end

    assert_redirected_to principios_ativos_nutriente_url(PrincipiosAtivosNutriente.last)
  end

  test "should show principios_ativos_nutriente" do
    get principios_ativos_nutriente_url(@principios_ativos_nutriente)
    assert_response :success
  end

  test "should get edit" do
    get edit_principios_ativos_nutriente_url(@principios_ativos_nutriente)
    assert_response :success
  end

  test "should update principios_ativos_nutriente" do
    patch principios_ativos_nutriente_url(@principios_ativos_nutriente), params: { principios_ativos_nutriente: { nutriente_id: @principios_ativos_nutriente.nutriente_id, percentual: @principios_ativos_nutriente.percentual, principio_ativos_id: @principios_ativos_nutriente.principio_ativos_id } }
    assert_redirected_to principios_ativos_nutriente_url(@principios_ativos_nutriente)
  end

  test "should destroy principios_ativos_nutriente" do
    assert_difference("PrincipiosAtivosNutriente.count", -1) do
      delete principios_ativos_nutriente_url(@principios_ativos_nutriente)
    end

    assert_redirected_to principios_ativos_nutrientes_url
  end
end
