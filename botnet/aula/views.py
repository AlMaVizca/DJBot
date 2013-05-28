from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from botnet.aula.models import Computadora, Aula
from django.shortcuts import render
from botnet.aula.forms import FormularioAulas, FormularioListaTareas
from botnet.aula.funciones import *
import django_rq


@login_required
def indice(request):
    return render(request, 'botnet/index.html')


@login_required
def aulas(request):
    cantidad = Aula.objects.count()
    return render(request, 'botnet/index.html')


@login_required
def tareas(request):
    cantidad = Aula.objects.count()
    return render(request, 'botnet/index.html')


@login_required
def ejecutar(request, lista_de_tareas=None):
    form_aula = FormularioAulas(request.POST or None)
    form_tareas = FormularioListaTareas(request.POST or None)
    if form_aula.is_valid() and form_tareas.is_valid():
        valores = dict(form_tareas.cleaned_data.items() +
                form_aula.cleaned_data.items())
        ips = [compu.ip for each in valores['aulas']
            for compu in Computadora.objects.filter(aula=each)]
        borrar_archivo()
        try:
            django_rq.enqueue(ejecutar_tareas, tareas=valores['tareas'],
                computadoras=ips)
        except:
            return HttpResponse("<h1>Estas ejecutando redis??</h1>")
        contexto = {'tareas': valores['tareas'],
            'aula': valores['aulas'],
            'computadoras': ips,
            }
        return render(request, 'botnet/ejecutando.html', contexto)
    try:
        tareas = lista_de_tareas.split(',')
    except:
        tareas = None
    formularioTareas = FormularioListaTareas(
    initial={'tareas': tareas})
    contexto = {
        'tareas': formularioTareas,
        'formulario': FormularioAulas(),
    }
    return render(request, 'botnet/ejecutar.html', contexto)


@login_required
def prender(request, lista_de_salas):
    pass
    salas = lista_de_salas.split(',')
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


@login_required
def mostrar_resultados(request, lista_de_salas=None):
    form_aula = FormularioAulas(request.POST or None)
    compus = None
    if form_aula.is_valid():
        valores = dict(form_aula.cleaned_data.items())
        compus = mostrar_aula(valores['aulas'])
    return render(request, 'botnet/mostrar_resultados.html',
            {'formulario': FormularioAulas(), 'computadoras': compus})