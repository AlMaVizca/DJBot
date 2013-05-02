from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.core.context_processors import csrf
from django.template import Context
from django.shortcuts import render_to_response
from botnet.aula.forms import FormularioEjecutar
from botnet.aula.models import Computadora, Tarea, Aula
import subprocess
from botnet import fabfile
import re


@login_required
def ejecutar(request, listaDeTareas):
    tareas = listaDeTareas.split(',')
    ejecutarFormulario = FormularioEjecutar(initial={'tareas': listaDeTareas})
    contexto = Context({
        'tareas': tareas,
        'formulario': ejecutarFormulario,
        })
    contexto.update(csrf(request))
    return render_to_response('botnet/ejecutar.html', contexto)


@login_required
@csrf_protect
def ejecutando(request):
    if request.method == 'POST':
        formulario = FormularioEjecutar(request.POST)
        if formulario.is_valid():
            valores = formulario.cleaned_data
            nombreAula = valores['aulas']
            tareas = valores['tareas'].split(',')
            computadoras = Computadora.objects.filter(aula=nombreAula)
            ips = escribir_ips(computadoras)
            borrar_archivo()
            ejecutar_tareas(tareas, ips)
            ejecutado = salida_computadora()
            contexto = Context({
                'tareas': tareas,
                'aula': nombreAula,
                'computadoras': computadoras,
                'ejecutado': ejecutado,
                })
            return render_to_response('botnet/ejecutando.html', contexto)
    else:
            return HttpResponse('<h1>Estas haciendo las cosas bien?</h1>')


def escribir_ips(computadoras):
    compu = []
    for each in computadoras.values():
        compu.append(each['ip'])
    return compu


def ejecutar_tareas(tareas, computadoras):
    for unaTarea in tareas:
        instrucciones = Tarea.objects.filter(nombre=unaTarea)
        receta = instrucciones.values()[0]['instrucciones'].split('\n')
        for each in receta:
            fabfile.ejecutar(each, computadoras)


@login_required
def prender(request, listaDeSalas):
    salas = listaDeSalas.split(',')
    for nombreAula in salas:
        computadoras = Computadora.objects.filter(aula=nombreAula)
        unAula = Aula.objects.get(nombre=nombreAula)
        compus = []
        for each in computadoras.values():
            compus = each['nombre']
            unAula.maquina_intermediaria
            fabfile.ejecutar('etherwake -i ' + unAula.interfaz + ' ' +
            each['mac'], [unAula.maquina_intermediaria])
    return HttpResponse(compus)


def borrar_archivo():
    subprocess.call(['rm', fabfile.ARCHIVO])


def obtener_ip(patron, linea):
    string = re.match(patron, linea).group(0)
    return re.sub("(\[)([0-9.]*)(\])", "\g<2>", string)


def obtener_salida(linea):
    salida = re.split("(: )", linea)
    try:
        tipo = re.search('run|out', salida[0]).group(0)
    except:
        tipo = 'out'
    return tipo, salida[2]


def salida_computadora():
    archivo = open(fabfile.ARCHIVO, 'r')
    computadoras = {}
    patronIp = re.compile("\[([0-9.]*)\]")
    for each in archivo.readlines():
        if re.match(patronIp, each):
            ip = obtener_ip(patronIp, each)
            tipo, salida = obtener_salida(each)
            try:
                computadoras[ip].append(tipo + ':' + salida)
            except:
                computadoras[ip] = [tipo + ':' + salida]

    archivo.close()
    return computadoras
