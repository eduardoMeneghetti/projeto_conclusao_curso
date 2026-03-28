## Configuração do ambiente de desenvolvimento

### Pré-requisitos
- WSL2 com Ubuntu
- Rails rodando no WSL
- Regra de entrada na porta 3000 do firewall

### Configuração do firewall (só na primeira vez) -- regra de entrada
Execute no `cmd` como administrador:
```bash
netsh advfirewall firewall add rule name="Rails 3000" dir=in action=allow protocol=TCP localport=3000
```

### Configuração do redirecionamento de porta
Sempre que reiniciar o computador, rode o script como administrador:
```powershell
.\sync-wsl.ps1
```
Isso atualiza o redirecionamento da porta 3000 do Windows para o WSL.

### Verificar se está funcionando
Acesse no navegador do celular (mesma rede Wi-Fi):
```
http://SEU_IP_WINDOWS:3000/up
```
Deve retornar `OK`.

### Verificar proxy atual 
```bash
netsh interface portproxy show all
```