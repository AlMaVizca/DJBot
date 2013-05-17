from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from botnet.aula.models import Computadora
from django.shortcuts import render
from botnet.aula.forms import FormularioAulas, FormularioListaTareas
from botnet.aula.funciones import *


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
        ejecutar_tareas(valores['tareas'], ips)
        ejecutado = salida_computadora()
        contexto = {'tareas': valores['tareas'],
            'aula': valores['aulas'][0],
            'computadoras': ips,
            'ejecutado': ejecutado,
            }
        return render(request, 'botnet/ejecutando.html', contexto)
    tareas = lista_de_tareas.split(',')
    formularioTareas = FormularioListaTareas(
    initial={'tareas': tareas})
    contexto = {
        'tareas': formularioTareas,
        'formulario': FormularioAulas(),
    }
    return render(request, 'botnet/ejecutar.html', contexto)



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








