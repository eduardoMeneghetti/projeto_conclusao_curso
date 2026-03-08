require "test_helper"

class RecomendacoesAgricolasItensControllerTest < ActionDispatch::IntegrationTest
  setup do
    @recomendacoes_agricolas_iten = recomendacoes_agricolas_itens(:one)
  end

  test "should get index" do
    get recomendacoes_agricolas_itens_url
    assert_response :success
  end

  test "should get new" do
    get new_recomendacoes_agricolas_iten_url
    assert_response :success
  end

  test "should create recomendacoes_agricolas_iten" do
    assert_difference("RecomendacoesAgricolasIten.count") do
      post recomendacoes_agricolas_itens_url, params: { recomendacoes_agricolas_iten: { dose: @recomendacoes_agricolas_iten.dose, insumo_id: @recomendacoes_agricolas_iten.insumo_id, principios_ativos_id: @recomendacoes_agricolas_iten.principios_ativos_id, quantidade: @recomendacoes_agricolas_iten.quantidade, recomendacoes_agricola_id: @recomendacoes_agricolas_iten.recomendacoes_agricola_id } }
    end

    assert_redirected_to recomendacoes_agricolas_iten_url(RecomendacoesAgricolasIten.last)
  end

  test "should show recomendacoes_agricolas_iten" do
    get recomendacoes_agricolas_iten_url(@recomendacoes_agricolas_iten)
    assert_response :success
  end

  test "should get edit" do
    get edit_recomendacoes_agricolas_iten_url(@recomendacoes_agricolas_iten)
    assert_response :success
  end

  test "should update recomendacoes_agricolas_iten" do
    patch recomendacoes_agricolas_iten_url(@recomendacoes_agricolas_iten), params: { recomendacoes_agricolas_iten: { dose: @recomendacoes_agricolas_iten.dose, insumo_id: @recomendacoes_agricolas_iten.insumo_id, principios_ativos_id: @recomendacoes_agricolas_iten.principios_ativos_id, quantidade: @recomendacoes_agricolas_iten.quantidade, recomendacoes_agricola_id: @recomendacoes_agricolas_iten.recomendacoes_agricola_id } }
    assert_redirected_to recomendacoes_agricolas_iten_url(@recomendacoes_agricolas_iten)
  end

  test "should destroy recomendacoes_agricolas_iten" do
    assert_difference("RecomendacoesAgricolasIten.count", -1) do
      delete recomendacoes_agricolas_iten_url(@recomendacoes_agricolas_iten)
    end

    assert_redirected_to recomendacoes_agricolas_itens_url
  end
end
