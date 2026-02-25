require "test_helper"

class AtividadeGlebasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @atividade_gleba = atividade_glebas(:one)
  end

  test "should get index" do
    get atividade_glebas_url
    assert_response :success
  end

  test "should get new" do
    get new_atividade_gleba_url
    assert_response :success
  end

  test "should create atividade_gleba" do
    assert_difference("AtividadeGleba.count") do
      post atividade_glebas_url, params: { atividade_gleba: { atividade_safra_id: @atividade_gleba.atividade_safra_id, gleba_id: @atividade_gleba.gleba_id } }
    end

    assert_redirected_to atividade_gleba_url(AtividadeGleba.last)
  end

  test "should show atividade_gleba" do
    get atividade_gleba_url(@atividade_gleba)
    assert_response :success
  end

  test "should get edit" do
    get edit_atividade_gleba_url(@atividade_gleba)
    assert_response :success
  end

  test "should update atividade_gleba" do
    patch atividade_gleba_url(@atividade_gleba), params: { atividade_gleba: { atividade_safra_id: @atividade_gleba.atividade_safra_id, gleba_id: @atividade_gleba.gleba_id } }
    assert_redirected_to atividade_gleba_url(@atividade_gleba)
  end

  test "should destroy atividade_gleba" do
    assert_difference("AtividadeGleba.count", -1) do
      delete atividade_gleba_url(@atividade_gleba)
    end

    assert_redirected_to atividade_glebas_url
  end
end
