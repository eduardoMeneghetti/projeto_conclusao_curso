import { useSQLiteContext } from "expo-sqlite";
import { TipoEntradaSaida, tipoMovimento } from "../util/tipoMov";

export type useAjusteEstoque = {
    id: number,
    usuario_id: number,
    propriedade_id: number,
    entrada_saida: TipoEntradaSaida,
    data: string,
    observacao: string,
    created_at: string,
    updated_at: string,
    synced_at: string | null,
    is_dirty: boolean,
    server_id: number | null,
    deleted_at: string | null
}

export type useAjusteEstoqueRaw = Omit<useAjusteEstoque, 'is_dirty'> & {
    is_dirty: number
}

function mapAjusteEstque(row: useAjusteEstoqueRaw): useAjusteEstoque {
    return {
        ...row,
        is_dirty: row.is_dirty === 1
    };
}

export function useAjusteEstoqueDatabase() {
    const database = useSQLiteContext();
    const { isEntrada, isSaida } = tipoMovimento();

    async function create(data: Pick<useAjusteEstoqueRaw, "usuario_id" | "propriedade_id" | "data" | "observacao" | "entrada_saida">) {

        const sentece = await database.prepareAsync(`
            INSERT INTO ajuste_estoques(usuario_id, propriedade_id, data, observacao, entrada_saida, created_at, updated_at, is_dirty)
            VALUES($usuario_id, $propriedade_id, $data, $observacao, $entrada_saida, datetime('now'), datetime('now'), 1)    
        `)

        try {

            const result = await sentece.executeAsync({
                $usuario_id: data.usuario_id,
                $propriedade_id: data.propriedade_id,
                $data: data.data,
                $observacao: data.observacao,
                $entrada_saida: data.entrada_saida
            })

            const insertedRowId = result.lastInsertRowId;

            return { insertedRowId };
        } catch (error) {
            console.error("Erro ao criar novo movimento de estoque: ", error)
            throw error;
        } finally {
            await sentece.finalizeAsync();
        }

    }

    async function getMovById(id: number) {
        try {
            const row = await database.getFirstAsync<useAjusteEstoqueRaw>(`
                SELECT * 
                FROM ajuste_estoques ae 
                WHERE ae.id = $id
            `,
                { $id: id }
            )

            return row ? mapAjusteEstque(row) : null;
        } catch (error) {
            console.error("Erro ao buscar movimento de ajuste", error)
            throw error
        }
    }

    async function getMovAll(propriedade_id: number) {
        try {
            const rows = await database.getAllAsync<{
                ajuste_id: number,
                entrada_saida: string,
                data: string,
                observacao: string,
                insumo_descricao: string,
                quantidade: number,
                valor_unitario: number,
                unidade_sigla: string,
            }>(`
            SELECT 
                ae.id as ajuste_id,
                ae.entrada_saida,
                ae.data,
                ae.observacao,
                i.descricao as insumo_descricao,
                mei.quantidade,
                mei.valor_unitario,
                um.sigla as unidade_sigla
            FROM ajuste_estoques ae
            INNER JOIN movimentacao_estoque_insumos mei ON mei.ajuste_estoque_id = ae.id
            INNER JOIN insumos i ON i.id = mei.insumo_id
            INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
            WHERE ae.propriedade_id = $propriedade_id
            AND ae.deleted_at IS NULL
            ORDER BY ae.data DESC, ae.id DESC
        `, { $propriedade_id: propriedade_id });

            const ajustesMap = new Map<number, {
                ajuste_id: number,
                entrada_saida: string,
                data: string,
                observacao: string,
                itens: { descricao: string, quantidade: number, valor_unitario: number, unidade: string }[]
            }>();

            for (const row of rows) {
                if (!ajustesMap.has(row.ajuste_id)) {
                    ajustesMap.set(row.ajuste_id, {
                        ajuste_id: row.ajuste_id,
                        entrada_saida: row.entrada_saida,
                        data: row.data,
                        observacao: row.observacao,
                        itens: []
                    });
                }
                ajustesMap.get(row.ajuste_id)!.itens.push({
                    descricao: row.insumo_descricao,
                    quantidade: row.quantidade,
                    valor_unitario: row.valor_unitario,
                    unidade: row.unidade_sigla
                });
            }

            return Array.from(ajustesMap.values());
        } catch (error) {
            console.error("Erro ao buscar movimentações: ", error);
            return [];
        }
    }

    async function getMovItensById(ajuste_id: number) {
        try {
            const rows = await database.getAllAsync<{
                insumo_id: number,
                descricao: string,
                quantidade: number,
                valor_unitario: number,
                unidade_sigla: string,
            }>(`
            SELECT 
                i.id as insumo_id,
                i.descricao,
                mei.quantidade,
                mei.valor_unitario,
                um.sigla as unidade_sigla
            FROM movimentacao_estoque_insumos mei
            INNER JOIN insumos i ON i.id = mei.insumo_id
            INNER JOIN unidades_medidas um ON um.id = i.unidades_medida_id
            WHERE mei.ajuste_estoque_id = $ajuste_id
            AND mei.deleted_at IS NULL
        `, { $ajuste_id: ajuste_id });

            return rows.map(row => ({
                insumo_id: row.insumo_id,
                descricao: row.descricao,
                quantidade: row.quantidade,
                valor_unitario: row.valor_unitario,
                unidade: row.unidade_sigla
            }));
        } catch (error) {
            console.error("Erro ao buscar itens da movimentação: ", error);
            return [];
        }
    }

    async function updateAjuste(data: Pick<useAjusteEstoqueRaw, "id" | "data" | "observacao">) {

        const sentece = await database.prepareAsync(`
            UPDATE ajuste_estoques
            SET data = $data,
                observacao = $observacao,
                updated_at = datetime('now'),
                is_dirty = 1
            WHERE id = $id
        `)

        try {

            await sentece.executeAsync({
                $id: data.id,
                $observacao: data.observacao,
                $data: data.data
            })

            console.log("Edição bem sucedida!")
        } catch (error) {
            console.error("Erro ao realizar ajuste alteração", error)
            throw error
        }finally{
            sentece.finalizeAsync();
        }

    }

    return {
        create,
        getMovById,
        getMovAll,
        getMovItensById,
        updateAjuste,

        isEntrada,
        isSaida,
    };
}