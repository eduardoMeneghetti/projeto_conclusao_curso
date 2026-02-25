require "test_helper"

class MovimentacaoEstoqueInsumosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @movimentacao_estoque_insumo = movimentacao_estoque_insumos(:one)
  end

  test "should get index" do
    get movimentacao_estoque_insumos_url
    assert_response :success
  end

  test "should get new" do
    get new_movimentacao_estoque_insumo_url
    assert_response :success
  end

  test "should create movimentacao_estoque_insumo" do
    assert_difference("MovimentacaoEstoqueInsumo.count") do
      post movimentacao_estoque_insumos_url, params: { movimentacao_estoque_insumo: { ajuste_estoque_id: @movimentacao_estoque_insumo.ajuste_estoque_id, insumo_id: @movimentacao_estoque_insumo.insumo_id, quantidade: @movimentacao_estoque_insumo.quantidade, valor_unitario: @movimentacao_estoque_insumo.valor_unitario } }
    end

    assert_redirected_to movimentacao_estoque_insumo_url(MovimentacaoEstoqueInsumo.last)
  end

  test "should show movimentacao_estoque_insumo" do
    get movimentacao_estoque_insumo_url(@movimentacao_estoque_insumo)
    assert_response :success
  end

  test "should get edit" do
    get edit_movimentacao_estoque_insumo_url(@movimentacao_estoque_insumo)
    assert_response :success
  end

  test "should update movimentacao_estoque_insumo" do
    patch movimentacao_estoque_insumo_url(@movimentacao_estoque_insumo), params: { movimentacao_estoque_insumo: { ajuste_estoque_id: @movimentacao_estoque_insumo.ajuste_estoque_id, insumo_id: @movimentacao_estoque_insumo.insumo_id, quantidade: @movimentacao_estoque_insumo.quantidade, valor_unitario: @movimentacao_estoque_insumo.valor_unitario } }
    assert_redirected_to movimentacao_estoque_insumo_url(@movimentacao_estoque_insumo)
  end

  test "should destroy movimentacao_estoque_insumo" do
    assert_difference("MovimentacaoEstoqueInsumo.count", -1) do
      delete movimentacao_estoque_insumo_url(@movimentacao_estoque_insumo)
    end

    assert_redirected_to movimentacao_estoque_insumos_url
  end
end
