require "test_helper"

class AtividadeSafrasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @atividade_safra = atividade_safras(:one)
  end

  test "should get index" do
    get atividade_safras_url
    assert_response :success
  end

  test "should get new" do
    get new_atividade_safra_url
    assert_response :success
  end

  test "should create atividade_safra" do
    assert_difference("AtividadeSafra.count") do
      post atividade_safras_url, params: { atividade_safra: { atividade_id: @atividade_safra.atividade_id, propriedade_id: @atividade_safra.propriedade_id, safra_id: @atividade_safra.safra_id } }
    end

    assert_redirected_to atividade_safra_url(AtividadeSafra.last)
  end

  test "should show atividade_safra" do
    get atividade_safra_url(@atividade_safra)
    assert_response :success
  end

  test "should get edit" do
    get edit_atividade_safra_url(@atividade_safra)
    assert_response :success
  end

  test "should update atividade_safra" do
    patch atividade_safra_url(@atividade_safra), params: { atividade_safra: { atividade_id: @atividade_safra.atividade_id, propriedade_id: @atividade_safra.propriedade_id, safra_id: @atividade_safra.safra_id } }
    assert_redirected_to atividade_safra_url(@atividade_safra)
  end

  test "should destroy atividade_safra" do
    assert_difference("AtividadeSafra.count", -1) do
      delete atividade_safra_url(@atividade_safra)
    end

    assert_redirected_to atividade_safras_url
  end
end
