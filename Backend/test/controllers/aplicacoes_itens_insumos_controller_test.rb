require "test_helper"

class AplicacoesItensInsumosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @aplicacoes_itens_insumo = aplicacoes_itens_insumos(:one)
  end

  test "should get index" do
    get aplicacoes_itens_insumos_url
    assert_response :success
  end

  test "should get new" do
    get new_aplicacoes_itens_insumo_url
    assert_response :success
  end

  test "should create aplicacoes_itens_insumo" do
    assert_difference("AplicacoesItensInsumo.count") do
      post aplicacoes_itens_insumos_url, params: { aplicacoes_itens_insumo: { aplicacoes_insumo_id: @aplicacoes_itens_insumo.aplicacoes_insumo_id, dose_aplic: @aplicacoes_itens_insumo.dose_aplic, insumo_id: @aplicacoes_itens_insumo.insumo_id, principios_ativo_id: @aplicacoes_itens_insumo.principios_ativo_id, quantidade_aplic: @aplicacoes_itens_insumo.quantidade_aplic } }
    end

    assert_redirected_to aplicacoes_itens_insumo_url(AplicacoesItensInsumo.last)
  end

  test "should show aplicacoes_itens_insumo" do
    get aplicacoes_itens_insumo_url(@aplicacoes_itens_insumo)
    assert_response :success
  end

  test "should get edit" do
    get edit_aplicacoes_itens_insumo_url(@aplicacoes_itens_insumo)
    assert_response :success
  end

  test "should update aplicacoes_itens_insumo" do
    patch aplicacoes_itens_insumo_url(@aplicacoes_itens_insumo), params: { aplicacoes_itens_insumo: { aplicacoes_insumo_id: @aplicacoes_itens_insumo.aplicacoes_insumo_id, dose_aplic: @aplicacoes_itens_insumo.dose_aplic, insumo_id: @aplicacoes_itens_insumo.insumo_id, principios_ativo_id: @aplicacoes_itens_insumo.principios_ativo_id, quantidade_aplic: @aplicacoes_itens_insumo.quantidade_aplic } }
    assert_redirected_to aplicacoes_itens_insumo_url(@aplicacoes_itens_insumo)
  end

  test "should destroy aplicacoes_itens_insumo" do
    assert_difference("AplicacoesItensInsumo.count", -1) do
      delete aplicacoes_itens_insumo_url(@aplicacoes_itens_insumo)
    end

    assert_redirected_to aplicacoes_itens_insumos_url
  end
end
