require "test_helper"

class AplicaoesInsumosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @aplicaoes_insumo = aplicaoes_insumos(:one)
  end

  test "should get index" do
    get aplicaoes_insumos_url
    assert_response :success
  end

  test "should get new" do
    get new_aplicaoes_insumo_url
    assert_response :success
  end

  test "should create aplicaoes_insumo" do
    assert_difference("AplicaoesInsumo.count") do
      post aplicaoes_insumos_url, params: { aplicaoes_insumo: { area_aplic: @aplicaoes_insumo.area_aplic, atividade_gleba_id: @aplicaoes_insumo.atividade_gleba_id, atividade_id: @aplicaoes_insumo.atividade_id, atividade_safra_id: @aplicaoes_insumo.atividade_safra_id, data_final: @aplicaoes_insumo.data_final, data_inicio: @aplicaoes_insumo.data_inicio, maquina_id: @aplicaoes_insumo.maquina_id, operador: @aplicaoes_insumo.operador, propriedade_id: @aplicaoes_insumo.propriedade_id, recomendacoes_agricola_id: @aplicaoes_insumo.recomendacoes_agricola_id, usuario_id: @aplicaoes_insumo.usuario_id } }
    end

    assert_redirected_to aplicaoes_insumo_url(AplicaoesInsumo.last)
  end

  test "should show aplicaoes_insumo" do
    get aplicaoes_insumo_url(@aplicaoes_insumo)
    assert_response :success
  end

  test "should get edit" do
    get edit_aplicaoes_insumo_url(@aplicaoes_insumo)
    assert_response :success
  end

  test "should update aplicaoes_insumo" do
    patch aplicaoes_insumo_url(@aplicaoes_insumo), params: { aplicaoes_insumo: { area_aplic: @aplicaoes_insumo.area_aplic, atividade_gleba_id: @aplicaoes_insumo.atividade_gleba_id, atividade_id: @aplicaoes_insumo.atividade_id, atividade_safra_id: @aplicaoes_insumo.atividade_safra_id, data_final: @aplicaoes_insumo.data_final, data_inicio: @aplicaoes_insumo.data_inicio, maquina_id: @aplicaoes_insumo.maquina_id, operador: @aplicaoes_insumo.operador, propriedade_id: @aplicaoes_insumo.propriedade_id, recomendacoes_agricola_id: @aplicaoes_insumo.recomendacoes_agricola_id, usuario_id: @aplicaoes_insumo.usuario_id } }
    assert_redirected_to aplicaoes_insumo_url(@aplicaoes_insumo)
  end

  test "should destroy aplicaoes_insumo" do
    assert_difference("AplicaoesInsumo.count", -1) do
      delete aplicaoes_insumo_url(@aplicaoes_insumo)
    end

    assert_redirected_to aplicaoes_insumos_url
  end
end
