from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from botnet.aula.models import Computadora, Aula
from django.shortcuts import render, redirect
from botnet.aula.forms import FormularioAulas, FormularioListaTareas
from botnet.aula.forms import FormularioResultados
from botnet.aula.funciones import *
from django.core.cache import cache
import django_rq


@login_required
def indice(request):
    formulario_aula = FormularioAulas(request.POST or None)
    formulario_tareas = FormularioListaTareas(request.POST or None)
    contexto = {'formulario_aula': formulario_aula,
        'formulario_tarea': formulario_tareas}
    if formulario_aula.is_valid() and formulario_tareas.is_valid():
        valores = dict(formulario_tareas.cleaned_data.items() +
                formulario_aula.cleaned_data.items())
        ips = [compu.ip for each in valores['aulas']
        for compu in Computadora.objects.filter(aula=each)]
        try:
            cache.set('tareas', valores['tareas'])
            django_rq.enqueue(ejecutar_tareas, tareas=valores['tareas'],
                computadoras=ips)
        except:
            return HttpResponse("<h1>Estas ejecutando redis??</h1>")
        return redirect('mostrar_resultados')
    return render(request, 'botnet/index.html', contexto)


@login_required
def ejecutar(request, lista_de_tareas=None):
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
    form_resultados = FormularioResultados(request.POST or None)
    compus = None
    if form_aula.is_valid() and form_resultados.is_valid():
        resultados = dict(form_resultados.cleaned_data.items())
        valores = dict(form_aula.cleaned_data.items())
        if resultados['mostrar'] == 'todos':
            compus = mostrar_aula(valores['aulas'])
        if resultados['mostrar'] == 'uno':
            compus = mostrar_computadora(resultados['ip'])
    return render(request, 'botnet/mostrar_resultados.html',
            {'formulario': FormularioAulas(), 'computadoras': compus,
            'mostrar': FormularioResultados()})
