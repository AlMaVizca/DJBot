# -*- coding: utf-8 -*-
from botnet.aula.models import Aula, Tarea, Configuracion, Computadora
from botnet import fabfile
import re
import subprocess
import os
import ipaddress


def mostrar_computadora(ip, mascara):
    archivo = open(fabfile.ARCHIVO, 'r')
    patronIp = re.compile("\[([0-9.]*)\]")
    computadoras = {}
    ip_buscada = ipaddress.IPv4Interface(unicode(ip) + '/' +
            unicode(mascara))
    for each in archivo.readlines():
        if re.match(patronIp, each):
            ip = unicode(obtener_ip(patronIp, each))
            una_ip = ipaddress.IPv4Interface(ip + '/' +
                    unicode(mascara))
            if (ip_buscada == una_ip):
                tipo, salida = obtener_salida(each)
                try:
                    computadoras[ip].append(tipo + ':' + salida)
                except:
                    computadoras[ip] = [tipo + ':' + salida]
    archivo.close()
    return computadoras


def mostrar_aula(aula):
    computadoras = {}
    for each in aula:
        un_aula = Aula.objects.get(nombre=each)
        sala = Computadora.objects.filter(aula=un_aula)
        for each in sala:
            una_computadora = mostrar_computadora(each.ip, un_aula.mascara)
            computadoras.update(una_computadora)
    return computadoras


def obtener_salida(linea):
    salida = re.split("(: )", linea)
    try:
        tipo = re.search('run|out', salida[0]).group(0)
    except:
        tipo = 'out'
    return tipo, salida[2]


def borrar_archivo():
    subprocess.call(['rm', fabfile.ARCHIVO])


def obtener_ip(patron, linea):
    string = re.match(patron, linea).group(0)
    return re.sub("(\[)([0-9.]*)(\])", "\g<2>", string)


def ejecutar_tareas(tareas, computadoras):
    for unaTarea in tareas:
        instrucciones = Tarea.objects.filter(nombre=unaTarea)
        receta = instrucciones.values()[0]['instrucciones'].split('\n')
        if os.path.isfile(instrucciones.values()[0]['archivo']):
            if instrucciones.values()[0]['dividir_archivo']:
                cantidad = len(computadoras)
                secuencia_temporal = os.path.join(
                    Configuracion.objects.get(nombre="temporal").valor,
                    Configuracion.objects.get(nombre="secuencia").valor)
                fabfile.cortar(cantidad, instrucciones.values()[0]['archivo'],
                    secuencia_temporal)
                for each in range(0, cantidad):
                    print secuencia_temporal + str(each)
                    fabfile.enviar(secuencia_temporal + str(each).zfill(2),
                        computadoras[each])
            else:
                fabfile.enviar(instrucciones.values()[0]['archivo'],
                    computadoras)
        for each in receta:
            fabfile.ejecutar(each, computadoras)

