require "test_helper"

class PropriedadesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @propriedade = propriedades(:one)
  end

  test "should get index" do
    get propriedades_url
    assert_response :success
  end

  test "should get new" do
    get new_propriedade_url
    assert_response :success
  end

  test "should create propriedade" do
    assert_difference("Propriedade.count") do
      post propriedades_url, params: { propriedade: { cidade_id: @propriedade.cidade_id, descricao: @propriedade.descricao, hectare: @propriedade.hectare } }
    end

    assert_redirected_to propriedade_url(Propriedade.last)
  end

  test "should show propriedade" do
    get propriedade_url(@propriedade)
    assert_response :success
  end

  test "should get edit" do
    get edit_propriedade_url(@propriedade)
    assert_response :success
  end

  test "should update propriedade" do
    patch propriedade_url(@propriedade), params: { propriedade: { cidade_id: @propriedade.cidade_id, descricao: @propriedade.descricao, hectare: @propriedade.hectare } }
    assert_redirected_to propriedade_url(@propriedade)
  end

  test "should destroy propriedade" do
    assert_difference("Propriedade.count", -1) do
      delete propriedade_url(@propriedade)
    end

    assert_redirected_to propriedades_url
  end
end
