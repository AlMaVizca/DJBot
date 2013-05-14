from fabric.api import *
from StringIO import StringIO
from aula.models import Configuracion
import sys
ARCHIVO = '/tmp/temporal'


@task
def configurar_entorno():
    env.reject_unknown_hosts = False
    env.disable_known_hosts = True
    env.user = Configuracion.objects.get(nombre="usuario").valor
    env.key_filename = Configuracion.objects.get(nombre="clave-privada").valor


@task
def ejecutar(tarea, computadoras):
    configurar_entorno()
    execute(ejecutar_clientes, instruccion=tarea, hosts=computadoras)


@task
def ejecutar_clientes(instruccion):
    env.user = Configuracion.objects.get(nombre="usuario").valor
    env.key_filename = Configuracion.objects.get(nombre="clave-privada").valor
    output = StringIO()
    error = StringIO()
    sys.stdout = output
    sys.stderr = error
    try:
        run(instruccion)
    except:
        print '[' + env.host_string + '] out: fallo'
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
    archivo = open(ARCHIVO, 'a')
    try:
        archivo.write(output.getvalue())
    except:
        archivo.write("esto falla")
    archivo.close()


@task
def generar_clave(nombre_archivo):
    local("ssh-keygen -f " + nombre_archivo)


@task
def enviar(archivo, computadoras):
    configurar_entorno()
    print archivo, computadoras
    execute(enviar_archivos, archivos=archivo, hosts=[computadoras])


@task
def enviar_archivos(archivos):
    put(archivos, '/tmp/archivo', mirror_local_mode=True)


@task
def cortar(cantidad, archivo, path):
    comando = "split -d -nl/" + str(cantidad) + " " + archivo + " " + path
    local(comando)















