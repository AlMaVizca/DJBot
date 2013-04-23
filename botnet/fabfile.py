from fabric.api import *
from StringIO import StringIO
import sys
ARCHIVO = '/tmp/temporal'


@task
def ejecutar(tarea, computadoras):
    env.reject_unknown_hosts = False
    env.disable_known_hosts = True
    execute(ejecutar_clientes, instruccion=tarea, hosts=computadoras)


@task
def ejecutar_clientes(instruccion):
    env.user = 'root'
    env.key_filename = '/opt/botnet/id_rsa'
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
