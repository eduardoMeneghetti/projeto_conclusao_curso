require "test_helper"

class GlebasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @gleba = glebas(:one)
  end

  test "should get index" do
    get glebas_url
    assert_response :success
  end

  test "should get new" do
    get new_gleba_url
    assert_response :success
  end

  test "should create gleba" do
    assert_difference("Gleba.count") do
      post glebas_url, params: { gleba: { area_hectares: @gleba.area_hectares, ativo: @gleba.ativo, descricao: @gleba.descricao, propriedade_id: @gleba.propriedade_id } }
    end

    assert_redirected_to gleba_url(Gleba.last)
  end

  test "should show gleba" do
    get gleba_url(@gleba)
    assert_response :success
  end

  test "should get edit" do
    get edit_gleba_url(@gleba)
    assert_response :success
  end

  test "should update gleba" do
    patch gleba_url(@gleba), params: { gleba: { area_hectares: @gleba.area_hectares, ativo: @gleba.ativo, descricao: @gleba.descricao, propriedade_id: @gleba.propriedade_id } }
    assert_redirected_to gleba_url(@gleba)
  end

  test "should destroy gleba" do
    assert_difference("Gleba.count", -1) do
      delete gleba_url(@gleba)
    end

    assert_redirected_to glebas_url
  end
end
