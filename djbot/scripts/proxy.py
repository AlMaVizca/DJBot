import socket
from ipaddress import ip_network


def check_ssh(host = '127.0.0.1'):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.03)
    result = sock.connect_ex((host,22))
    if result == 0:
        return True
    else:
        return False

def check_network(network = '127.0.0.1/8'):
    """ cuello de botella"""
    list_hosts = list(ip_network(network).hosts())
    hosts = []
    for host in list_hosts:
        ip = unicode(str(host))
        if check_ssh(ip):
            hosts.append(ip)
    return hosts

        
if __name__ == '__main__' :
    check_ssh()