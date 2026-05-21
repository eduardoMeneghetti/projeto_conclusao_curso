const doseP: Record<string, number> = {
    muitoBaixo: 130,
    baixo:      90,
    medio:      60,
    alto:        30,
    muitoAlto:   0,
};


const doseK: Record<string, number> = {
    muitoBaixo: 120,
    baixo:       80,
    medio:       60,
    alto:         30,
    muitoAlto:    0,
};


const doseN: Record<string, Record<string, number>> = {
    soja:       { baixo: 0,  medio: 0,  alto: 0  }, 
    milho:      { baixo: 80, medio: 60, alto: 40 },
    trigo:      { baixo: 80, medio: 60, alto: 20 },
    aveaBranca: { baixo: 80, medio: 60, alto: 20 },
    aveiaPreta: { baixo: 80, medio: 60, alto: 20 },
    cevada:     { baixo: 80, medio: 60, alto: 20 },
    canola:     { baixo: 80, medio: 60, alto: 40 },
    feijao:     { baixo: 40, medio: 30, alto: 20 },
};

const atividadeMap: Record<string, string> = {
    'SOJA':         'soja',
    'MILHO':        'milho',
    'TRIGO':        'trigo',
    'AVEIA BRANCA': 'aveaBranca',
    'AVEIA PRETA':  'aveiaPreta',
    'CEVADA':       'cevada',
    'CANOLA':       'canola',
    'FEIJÃO':       'feijao',
};

export function normalizarAtividade(descricao: string): string {
    return atividadeMap[descricao.toUpperCase()] ?? descricao.toLowerCase();
}

export function calcularDoseP(classificacao: string): number {
    return doseP[classificacao] ?? 0;
}

export function calcularDoseK(classificacao: string): number {
    return doseK[classificacao] ?? 0;
}

export function calcularDoseN(classeM0: string, atividade: string): number {
    const cultura = doseN[atividade];
    if (!cultura) return 0;
    return cultura[classeM0] ?? 0;
}

export function calcularQuantidadeInsumo(
    dose: number,
    percentualNutriente: number
): number {
    if (percentualNutriente <= 0) return 0;
    return dose / (percentualNutriente / 100);
}

export function calcularTotalArea(
    quantidadeHa: number,
    area: number
): number {
    return quantidadeHa * area;
}