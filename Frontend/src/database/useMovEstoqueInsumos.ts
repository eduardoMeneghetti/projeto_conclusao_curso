import { useSQLiteContext } from "expo-sqlite";

export type useMovInsumo = {
    id: number,
    quantidade: number,
    valor_unitario: number,
    ajuste_estoque_id: number,
    insumo_id: number,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

export type useMovInsumoRaw = Omit<useMovInsumo, "is_dirty"> & {
    is_dirty: number
}

function mapMovInsumo(row: useMovInsumoRaw): useMovInsumo {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    }
}

export function UseMovEstoqueInsumos() {
    const database = useSQLiteContext();

    async function createMovInsumo(data: Pick<useMovInsumoRaw, "quantidade" | "valor_unitario" | "insumo_id" | "ajuste_estoque_id">, entrada_saida: 'E' | 'S') {

        const quantidade = entrada_saida === 'S' ? -Math.abs(data.quantidade) : Math.abs(data.quantidade);

        const sentece = await database.prepareAsync(`
        INSERT INTO movimentacao_estoque_insumos(ajuste_estoque_id, insumo_id, quantidade, valor_unitario, created_at, updated_at, is_dirty)
        VALUES($ajuste_estoque_id, $insumo_id, $quantidade, $valor_unitario, datetime('now'), datetime('now'), 1)
        `)

        try {
            const result = await sentece.executeAsync({
                $ajuste_estoque_id: data.ajuste_estoque_id,
                $insumo_id: data.insumo_id,
                $quantidade: quantidade,
                $valor_unitario: data.valor_unitario
            })

            return { lastInsertRowId: result.lastInsertRowId }
        } catch (error) {
            console.error("Erro ao cadastrar movimento", error)
            throw error
        } finally {
            await sentece.finalizeAsync();
        }
    }

    async function saldoItemById(insumo_id: number, propriedade_id: number) {
        try {
            const row = await database.getFirstAsync<{ saldo: number }>(
                `SELECT COALESCE(SUM(quantidade), 0) as saldo
                FROM movimentacao_estoque_insumos mei
                INNER JOIN ajuste_estoques ae ON ae.id = mei.ajuste_estoque_id
                WHERE mei.insumo_id = $insumo_id
                AND ae.propriedade_id = $propriedade_id
                AND mei.deleted_at IS NULL
                AND ae.deleted_at IS NULL`,
                { $insumo_id: insumo_id, $propriedade_id: propriedade_id }
            )

            return row ? row.saldo : 0
        } catch (error) {
            console.error("Erro ao trazer saldo de insumo: ", error)
            throw error
        }
    }

    async function validarSaidaSemNegatacao(
        insumo_id: number,
        quantidade_saida: number,
        propriedade_id: number,
        descricao_insumo: string
    ): Promise<{ valido: boolean; mensagem?: string }> {
        try {
            const saldoAtual = await saldoItemById(insumo_id, propriedade_id);
            const saldoFinal = saldoAtual - Math.abs(quantidade_saida);

            if (saldoFinal < 0) {
                return {
                    valido: false,
                    mensagem: `Saldo negativo detectado!\n\nInsumo: ${descricao_insumo}\nSaldo atual: ${saldoAtual}\nQuantidade saída: ${Math.abs(quantidade_saida)}\nSaldo resultante: ${saldoFinal}\n\nNão é permitido registrar saídas que deixem o saldo negativo.`
                };
            }

            return { valido: true };
        } catch (error) {
            console.error("Erro ao validar saída: ", error);
            throw error;
        }
    }

    async function validarSaidaSemNegatacaoAoEditar(
        insumo_id: number,
        quantidade_saida_nova: number,
        ajuste_id: number,
        propriedade_id: number,
        descricao_insumo: string
    ): Promise<{ valido: boolean; mensagem?: string }> {
        try {
            // Busca o saldo anterior que foi deletado (soft delete)
            const rowAnterior = await database.getFirstAsync<{ saldo_anterior: number }>(
                `SELECT COALESCE(SUM(quantidade), 0) as saldo_anterior
                FROM movimentacao_estoque_insumos mei
                WHERE mei.insumo_id = $insumo_id
                AND mei.ajuste_estoque_id = $ajuste_id`,
                { $insumo_id: insumo_id, $ajuste_id: ajuste_id }
            )

            const saldoAnterior = rowAnterior ? rowAnterior.saldo_anterior : 0;
            
            // Busca o saldo atual (sem contar os itens deletados)
            const saldoAtual = await saldoItemById(insumo_id, propriedade_id);
            
            // Calcula o saldo depois de remover o anterior e adicionar o novo
            const saldoFinal = saldoAtual + saldoAnterior - Math.abs(quantidade_saida_nova);

            if (saldoFinal < 0) {
                return {
                    valido: false,
                    mensagem: `Saldo negativo detectado!\n\nInsumo: ${descricao_insumo}\nSaldo atual: ${saldoAtual}\nSaldo anterior removido: ${saldoAnterior}\nQuantidade saída: ${Math.abs(quantidade_saida_nova)}\nSaldo resultante: ${saldoFinal}\n\nNão é permitido registrar saídas que deixem o saldo negativo.`
                };
            }

            return { valido: true };
        } catch (error) {
            console.error("Erro ao validar saída ao editar: ", error);
            throw error;
        }
    }

    async function deleteMovItensById(ajuste_id: number) {
        try {
            const sentece = await database.prepareAsync(`
                UPDATE movimentacao_estoque_insumos
                SET deleted_at = datetime('now'), is_dirty = 1
                WHERE ajuste_estoque_id = $ajuste_id
            `)

            await sentece.executeAsync({
                $ajuste_id: ajuste_id
            });

            await sentece.finalizeAsync();
        } catch (error) {
            console.error("Erro ao deletar itens da movimentação: ", error);
            throw error;
        }
    }

    async function canDeleteAjuste(ajuste_id: number, propriedade_id: number): Promise<{ pode: boolean, motivo?: string }> {
        try {
            const itensAjuste = await database.getAllAsync<{
                insumo_id: number,
                quantidade: number,
                insumo_descricao: string
            }>(`
            SELECT mei.insumo_id, mei.quantidade, i.descricao as insumo_descricao
            FROM movimentacao_estoque_insumos mei
            INNER JOIN insumos i ON i.id = mei.insumo_id
            WHERE mei.ajuste_estoque_id = $ajuste_id
            AND mei.deleted_at IS NULL
        `, { $ajuste_id: ajuste_id });

            for (const item of itensAjuste) {
                const saldoAtual = await saldoItemById(item.insumo_id, propriedade_id);
                // Remove o impacto do item (quantidade já tem o sinal correto: positivo para entrada, negativo para saída)
                const saldoAposDeletar = saldoAtual - item.quantidade;

                if (saldoAposDeletar < 0) {
                    return {
                        pode: false,
                        motivo: `Saldo insuficiente para "${item.insumo_descricao}".\nSaldo atual: ${saldoAtual.toLocaleString('pt-BR')}\nApós deleção: ${saldoAposDeletar.toLocaleString('pt-BR')}`
                    };
                }
            }

            return { pode: true };
        } catch (error) {
            console.error("Erro ao verificar saldo:", error);
            return { pode: false, motivo: 'Erro ao verificar saldo' };
        }
    }

    async function deleteAjusteCompleto(ajuste_id: number, propriedade_id: number): Promise<{ sucesso: boolean, motivo?: string }> {
        try {
            const { pode, motivo } = await canDeleteAjuste(ajuste_id, propriedade_id);

            if (!pode) {
                return { sucesso: false, motivo };
            }

            await deleteMovItensById(ajuste_id);

            await database.runAsync(
                `UPDATE ajuste_estoques
             SET deleted_at = datetime('now'), is_dirty = 1
             WHERE id = $id`,
                { $id: ajuste_id }
            );

            return { sucesso: true };
        } catch (error) {
            console.error("Erro ao deletar ajuste:", error);
            return { sucesso: false, motivo: 'Erro ao deletar movimentação' };
        }
    }


    return { createMovInsumo, saldoItemById, validarSaidaSemNegatacao, validarSaidaSemNegatacaoAoEditar, deleteMovItensById, deleteAjusteCompleto, canDeleteAjuste }
}