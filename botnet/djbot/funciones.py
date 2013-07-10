import os
import ast
from botnet.djbot.models import Aula, Tarea, Configuracion, Computadora
from botnet import fabfile
from redis_cache import get_redis_connection


def agregar_salida(ip, tarea, resultado):
    try:
        resultado[ip].update({each, computadoras[tarea][ip]})
    except:
        resultado[ip][tarea] = computadoras[tarea][ip]
	

def mostrar_computadora(cache, ip):
    """Las claves de computadoras son el comando ejecutado"""
    resultado = {ip: {}}
    if isinstance(cache, str):
        computadoras = ast.literal_eval(cache)
        for each in computadoras.keys():
            if (not computadoras[each][ip]):
                computadoras[each][ip] = "La salida no mostro resultado"
            try:
                resultado[ip].update({each, computadoras[each][ip]})
            except:
                resultado[ip][each] = computadoras[each][ip]
                
        return resultado
    return {}


def mostrar_aula(aula):
    computadoras = {}
    for each in aula:
        cache = get_redis_connection('default')
        resultado_cache = cache.get(each)
        un_aula = Aula.objects.get(nombre=each)
        sala = Computadora.objects.filter(aula=un_aula)
        for each in sala:
            una_computadora = mostrar_computadora(resultado_cache, each.ip)
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


def ejecutar_tareas(tareas, salas):
    for sala in salas.keys():
        for each in tareas:
            una_tarea = Tarea.objects.get(nombre=each)
            archivo = str(una_tarea.archivo)
            apagadas = repartir_archivo(archivo, una_tarea.dividir_archivo,
                                        salas[sala])
            receta = una_tarea.instrucciones.split('\n')
            cache = get_redis_connection('default')
            ejecutado = {}
            for each in receta:
                salida = fabfile.ejecutar(each, salas[sala])
                ejecutado[each] = salida
                cache.set(sala, ejecutado)
                cache.set('apagadas', apagadas)





