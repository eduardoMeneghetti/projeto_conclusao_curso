require "test_helper"

class TalhosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @talho = talhos(:one)
  end

  test "should get index" do
    get talhos_url
    assert_response :success
  end

  test "should get new" do
    get new_talho_url
    assert_response :success
  end

  test "should create talho" do
    assert_difference("Talho.count") do
      post talhos_url, params: { talho: { area_hectares: @talho.area_hectares, ativo: @talho.ativo, descricao: @talho.descricao, propriedade_id: @talho.propriedade_id } }
    end

    assert_redirected_to talho_url(Talho.last)
  end

  test "should show talho" do
    get talho_url(@talho)
    assert_response :success
  end

  test "should get edit" do
    get edit_talho_url(@talho)
    assert_response :success
  end

  test "should update talho" do
    patch talho_url(@talho), params: { talho: { area_hectares: @talho.area_hectares, ativo: @talho.ativo, descricao: @talho.descricao, propriedade_id: @talho.propriedade_id } }
    assert_redirected_to talho_url(@talho)
  end

  test "should destroy talho" do
    assert_difference("Talho.count", -1) do
      delete talho_url(@talho)
    end

    assert_redirected_to talhos_url
  end
end
