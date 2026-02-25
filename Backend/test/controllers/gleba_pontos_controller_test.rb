require "test_helper"

class GlebaPontosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @gleba_ponto = gleba_pontos(:one)
  end

  test "should get index" do
    get gleba_pontos_url
    assert_response :success
  end

  test "should get new" do
    get new_gleba_ponto_url
    assert_response :success
  end

  test "should create gleba_ponto" do
    assert_difference("GlebaPonto.count") do
      post gleba_pontos_url, params: { gleba_ponto: { gleba_id: @gleba_ponto.gleba_id, latitude: @gleba_ponto.latitude, longitude: @gleba_ponto.longitude, ordem: @gleba_ponto.ordem } }
    end

    assert_redirected_to gleba_ponto_url(GlebaPonto.last)
  end

  test "should show gleba_ponto" do
    get gleba_ponto_url(@gleba_ponto)
    assert_response :success
  end

  test "should get edit" do
    get edit_gleba_ponto_url(@gleba_ponto)
    assert_response :success
  end

  test "should update gleba_ponto" do
    patch gleba_ponto_url(@gleba_ponto), params: { gleba_ponto: { gleba_id: @gleba_ponto.gleba_id, latitude: @gleba_ponto.latitude, longitude: @gleba_ponto.longitude, ordem: @gleba_ponto.ordem } }
    assert_redirected_to gleba_ponto_url(@gleba_ponto)
  end

  test "should destroy gleba_ponto" do
    assert_difference("GlebaPonto.count", -1) do
      delete gleba_ponto_url(@gleba_ponto)
    end

    assert_redirected_to gleba_pontos_url
  end
end
