iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

iptables -A FORWARD -m state --state new -p tcp --dport 22 -s <direccion_de_red_de_la_sala> -j ACCEPT

iptables -A FORWARD -m state --state NEW -s <ip_de_maquina_central> -d <direccion_de_red_de_la_sala> -j ACCEPT

iptables -P FORWARD DROP
