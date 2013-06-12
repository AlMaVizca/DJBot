import re
import subprocess
import os
import django_rq
import ast
from botnet.aula.models import Aula, Tarea, Configuracion, Computadora
from botnet import fabfile
from redis_cache import get_redis_connection


def mostrar_computadora(ip):
    """Las claves de computadoras son el comando ejecutado"""
    cache = get_redis_connection('default')
    computadoras = cache.get("ejecutado")
    resultado = {ip: {}}
    if isinstance(computadoras, str):
        computadoras = ast.literal_eval(computadoras)
        for each in computadoras.keys():
            if computadoras[each][ip]:
                try:
                    resultado[ip].update({each, computadoras[each][ip]})
                except:
                    resultado[ip][each] = computadoras[each][ip]
        return resultado
    return {}


def mostrar_aula(aula):
    computadoras = {}
    for each in aula:
        un_aula = Aula.objects.get(nombre=each)
        sala = Computadora.objects.filter(aula=un_aula)
        for each in sala:
            una_computadora = mostrar_computadora(each.ip)
            computadoras.update(una_computadora)
    return computadoras


def repartir_archivo(archivo, dividir, computadoras):
    apagadas = []
    if os.path.isfile(archivo):
        if dividir is True:
            cantidad = len(computadoras)
            secuencia_temporal = os.path.join(
                Configuracion.objects.get(nombre="temporal").valor,
                Configuracion.objects.get(nombre="secuencia").valor)
            fabfile.cortar(cantidad, archivo, secuencia_temporal)
            for each in range(0, cantidad):
                try:
                    fabfile.enviar(secuencia_temporal + str(each).zfill(2),
                            [computadoras[each]])
                except:
                    apagadas.append(computadoras[each])
        else:
            fabfile.enviar(archivo, computadoras)
    return apagadas

def ejecutar_tareas(tareas, computadoras):
    for each in tareas:
        una_tarea = Tarea.objects.get(nombre=each)
        archivo = str(una_tarea.archivo)
        apagadas = repartir_archivo(archivo, una_tarea.dividir_archivo, computadoras)
        receta = una_tarea.instrucciones.split('\n')
        cache = get_redis_connection('default')
        ejecutado = {}
        for each in receta:
            salida = fabfile.ejecutar(each, computadoras)
            ejecutado[each] = salida
        cache.set('ejecutado', ejecutado)
        cache.set('apagadas', apagadas)



        

