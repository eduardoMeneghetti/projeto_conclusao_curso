export type TipoEntradaSaida = 'E' | 'S';

function isEntrada(value: TipoEntradaSaida): boolean {
    return value === 'E';
}

function isSaida(value: TipoEntradaSaida): boolean {
    return value === 'S';
}

export function tipoMovimento(){
    return {
        isEntrada,
        isSaida,
    };
}
