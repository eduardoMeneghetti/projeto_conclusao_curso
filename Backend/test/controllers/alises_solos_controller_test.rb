require "test_helper"

class AlisesSolosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @alises_solo = alises_solos(:one)
  end

  test "should get index" do
    get alises_solos_url
    assert_response :success
  end

  test "should get new" do
    get new_alises_solo_url
    assert_response :success
  end

  test "should create alises_solo" do
    assert_difference("AlisesSolo.count") do
      post alises_solos_url, params: { alises_solo: { aatividade_gleba_id: @alises_solo.aatividade_gleba_id, atividade_id: @alises_solo.atividade_id, atividade_safra_id: @alises_solo.atividade_safra_id, data_coleta: @alises_solo.data_coleta, propriedade_id: @alises_solo.propriedade_id, safra_id: @alises_solo.safra_id } }
    end

    assert_redirected_to alises_solo_url(AlisesSolo.last)
  end

  test "should show alises_solo" do
    get alises_solo_url(@alises_solo)
    assert_response :success
  end

  test "should get edit" do
    get edit_alises_solo_url(@alises_solo)
    assert_response :success
  end

  test "should update alises_solo" do
    patch alises_solo_url(@alises_solo), params: { alises_solo: { aatividade_gleba_id: @alises_solo.aatividade_gleba_id, atividade_id: @alises_solo.atividade_id, atividade_safra_id: @alises_solo.atividade_safra_id, data_coleta: @alises_solo.data_coleta, propriedade_id: @alises_solo.propriedade_id, safra_id: @alises_solo.safra_id } }
    assert_redirected_to alises_solo_url(@alises_solo)
  end

  test "should destroy alises_solo" do
    assert_difference("AlisesSolo.count", -1) do
      delete alises_solo_url(@alises_solo)
    end

    assert_redirected_to alises_solos_url
  end
end
