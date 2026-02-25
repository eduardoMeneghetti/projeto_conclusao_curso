require "test_helper"

class AnalisesSolosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @analises_solo = analises_solos(:one)
  end

  test "should get index" do
    get analises_solos_url
    assert_response :success
  end

  test "should get new" do
    get new_analises_solo_url
    assert_response :success
  end

  test "should create analises_solo" do
    assert_difference("AnalisesSolo.count") do
      post analises_solos_url, params: { analises_solo: { aatividade_gleba_id: @analises_solo.aatividade_gleba_id, atividade_id: @analises_solo.atividade_id, atividade_safra_id: @analises_solo.atividade_safra_id, data_coleta: @analises_solo.data_coleta, propriedade_id: @analises_solo.propriedade_id, safra_id: @analises_solo.safra_id } }
    end

    assert_redirected_to analises_solo_url(AnalisesSolo.last)
  end

  test "should show analises_solo" do
    get analises_solo_url(@analises_solo)
    assert_response :success
  end

  test "should get edit" do
    get edit_analises_solo_url(@analises_solo)
    assert_response :success
  end

  test "should update analises_solo" do
    patch analises_solo_url(@analises_solo), params: { analises_solo: { aatividade_gleba_id: @analises_solo.aatividade_gleba_id, atividade_id: @analises_solo.atividade_id, atividade_safra_id: @analises_solo.atividade_safra_id, data_coleta: @analises_solo.data_coleta, propriedade_id: @analises_solo.propriedade_id, safra_id: @analises_solo.safra_id } }
    assert_redirected_to analises_solo_url(@analises_solo)
  end

  test "should destroy analises_solo" do
    assert_difference("AnalisesSolo.count", -1) do
      delete analises_solo_url(@analises_solo)
    end

    assert_redirected_to analises_solos_url
  end
end
