from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from botnet.aula.models import Computadora, Tarea
from django.template import RequestContext
from django.shortcuts import render_to_response
from botnet.aula.forms import FormularioEjecutar
from botnet.aula.funciones import *


@login_required
def ejecutar(request, listaDeTareas):
    tareas = listaDeTareas.split(',')
    lista = []
    for each in tareas:
        lista.append(Tarea.objects.get(nombre=each))
    ejecutarFormulario = FormularioEjecutar(initial={'tareas': listaDeTareas})
    contexto = RequestContext(request, {
        'tareas': lista,
        'formulario': ejecutarFormulario,
        })
    return render_to_response('botnet/ejecutar.html', contexto)


@login_required
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








