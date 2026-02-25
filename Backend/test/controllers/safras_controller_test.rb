require "test_helper"

class SafrasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @safra = safras(:one)
  end

  test "should get index" do
    get safras_url
    assert_response :success
  end

  test "should get new" do
    get new_safra_url
    assert_response :success
  end

  test "should create safra" do
    assert_difference("Safra.count") do
      post safras_url, params: { safra: { data_final: @safra.data_final, data_inicio: @safra.data_inicio, descricao: @safra.descricao } }
    end

    assert_redirected_to safra_url(Safra.last)
  end

  test "should show safra" do
    get safra_url(@safra)
    assert_response :success
  end

  test "should get edit" do
    get edit_safra_url(@safra)
    assert_response :success
  end

  test "should update safra" do
    patch safra_url(@safra), params: { safra: { data_final: @safra.data_final, data_inicio: @safra.data_inicio, descricao: @safra.descricao } }
    assert_redirected_to safra_url(@safra)
  end

  test "should destroy safra" do
    assert_difference("Safra.count", -1) do
      delete safra_url(@safra)
    end

    assert_redirected_to safras_url
  end
end
