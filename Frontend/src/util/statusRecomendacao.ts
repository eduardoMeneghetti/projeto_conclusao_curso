export type StatusRecomendacao = 'F' | 'P' | 'A' | 'R';

export const STATUS_LABELS: Record<StatusRecomendacao, string> = {
    F: 'Finalizado',
    P: 'Pendente',
    A: 'Atrasado',
    R: 'Parcial',
};

export const STATUS_COLORS: Record<StatusRecomendacao, string> = {
    F: '#2ECC71',  // verde
    P: '#F39C12',  // amarelo
    A: '#E74C3C',  // vermelho
    R: '#3498DB',  // azul
};

export function getStatusLabel(status: StatusRecomendacao): string {
    return STATUS_LABELS[status];
}

export function getStatusColor(status: StatusRecomendacao): string {
    return STATUS_COLORS[status];
}

export function isValidStatus(value: string): value is StatusRecomendacao {
    return ['F', 'P', 'A', 'R'].includes(value);
}