# pega o IP atual do WSL
$wslIp = (wsl hostname -I).Trim()

# remove a regra antiga
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0

# adiciona com o novo IP
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIp

Write-Host "WSL IP atualizado para: $wslIp"