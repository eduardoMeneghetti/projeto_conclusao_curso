export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isStrongPassword(senha: string): { valid: boolean; message: string } {
    if (senha.length < 8) {
        return { valid: false, message: 'Senha deve ter no mínimo 8 caracteres' };
    }
    if (!/[A-Z]/.test(senha)) {
        return { valid: false, message: 'Senha deve ter pelo menos uma letra maiúscula' };
    }
    if (!/[0-9]/.test(senha)) {
        return { valid: false, message: 'Senha deve ter pelo menos um número' };
    }
    if (!/[!@#$%^&*]/.test(senha)) {
        return { valid: false, message: 'Senha deve ter pelo menos um caractere especial (!@#$%^&*)' };
    }
    return { valid: true, message: '' };
}

export function passwordsMatch(senha: string, confirmarSenha: string): boolean {
    return senha === confirmarSenha;
}