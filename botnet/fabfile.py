from fabric.api import *
from aula.models import Configuracion


@task
def configurar_entorno():
    env.reject_unknown_hosts = False
    env.disable_known_hosts = True
    env.user = Configuracion.objects.get(nombre="usuario").valor
    env.key_filename = Configuracion.objects.get(nombre="clave-privada").valor


@task
def ejecutar(tarea, computadoras):
    configurar_entorno()
    return execute(ejecutar_clientes, instruccion=tarea, hosts=computadoras)


@task
@parallel
def ejecutar_clientes(instruccion):
    try:
        salida = run(instruccion)
    except:
        salida = 'fallo'
    return str(salida)


@task
def generar_clave(nombre_archivo):
    local("ssh-keygen -f " + nombre_archivo)


@task
def enviar(archivo, computadoras):
    configurar_entorno()
    execute(enviar_archivos, archivos=archivo, hosts=computadoras)


@task
@parallel
def enviar_archivos(archivos):
    put(archivos, '/tmp/archivo', mirror_local_mode=True)


@task
def cortar(cantidad, archivo, path):
    comando = "split -d -nl/" + str(cantidad) + " " + archivo + " " + path
    local(comando)
