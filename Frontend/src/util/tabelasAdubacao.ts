const tabelaP: Record<string, Record<string, [number, number]>> = {
    classe1: {
        muitoBaixo: [0, 4],
        baixo:      [5, 8],
        medio:      [9, 18],
        alto:       [19, 35],
        muitoAlto:  [36, Infinity],
    },
    classe2: {
        muitoBaixo: [0, 6],
        baixo:      [7, 12],
        medio:      [13, 24],
        alto:       [25, 48],
        muitoAlto:  [49, Infinity],
    },
    classe3: {
        muitoBaixo: [0, 9],
        baixo:      [10, 18],
        medio:      [19, 36],
        alto:       [37, 70],
        muitoAlto:  [71, Infinity],
    },
    classe4: {
        muitoBaixo: [0, 12],
        baixo:      [13, 24],
        medio:      [25, 48],
        alto:       [49, 90],
        muitoAlto:  [91, Infinity],
    },
};

const tabelaK: Record<string, Record<string, [number, number]>> = {
    baixa: {
        muitoBaixo: [0, 20],
        baixo:      [21, 40],
        medio:      [41, 60],
        alto:       [61, 120],
        muitoAlto:  [121, Infinity],
    },
    media: {
        muitoBaixo: [0, 30],
        baixo:      [31, 60],
        medio:      [61, 90],
        alto:       [91, 180],
        muitoAlto:  [181, Infinity],
    },
    alta: {
        muitoBaixo: [0, 40],
        baixo:      [41, 80],
        medio:      [81, 120],
        alto:       [121, 240],
        muitoAlto:  [241, Infinity],
    },
    muitoAlta: {
        muitoBaixo: [0, 45],
        baixo:      [46, 90],
        medio:      [91, 135],
        alto:       [136, 270],
        muitoAlto:  [271, Infinity],
    },
};

function getClasseArgila(argila: number): string {
    if (argila < 15) return 'classe1';
    if (argila < 35) return 'classe2';
    if (argila < 60) return 'classe3';
    return 'classe4';
}

function getClasseCTC(ctc: number): string {
    if (ctc <= 7.5)  return 'baixa';
    if (ctc <= 15.0) return 'media';
    if (ctc <= 30.0) return 'alta';
    return 'muitoAlta';
}

function classificarPorTabela(
    tabela: Record<string, Record<string, [number, number]>>,
    chave: string,
    valor: number
): string {
    const faixa = tabela[chave];
    if (!faixa) return 'indefinido';
    for (const [classificacao, [min, max]] of Object.entries(faixa)) {
        if (valor >= min && valor <= max) return classificacao;
    }
    return 'indefinido';
}

export function classificarP(valorP: number, argila: number): string {
    return classificarPorTabela(tabelaP, getClasseArgila(argila), valorP);
}

export function classificarK(valorK: number, ctc: number): string {
    return classificarPorTabela(tabelaK, getClasseCTC(ctc), valorK);
}

export { getClasseArgila, getClasseCTC };