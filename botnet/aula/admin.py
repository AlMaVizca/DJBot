from botnet.aula.models import Aula, Computadora, Tarea
from django.contrib import admin
from botnet.aula.forms import FormularioTareas, FormularioAula,\
    FormularioComputadora
from django.http import HttpResponseRedirect


###Aulas
class ComputadorasNuevas(admin.TabularInline):
    model = Computadora
    extra = 1
    form = FormularioComputadora


class AulaAdmin(admin.ModelAdmin):
    inlines = [ComputadorasNuevas]
    actions = ['prender_sala']
    list_display = ('nombre', 'cantidad_computadoras')
    search_fields = ['nombre']
    form = FormularioAula

    def prender_sala(self, request, queryset):
        seleccionado = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        lista_salas = ''
        index = 0
        while (index < (len(seleccionado) - 1)):
            lista_salas += seleccionado[index] + ','
            index += 1
        lista_salas += seleccionado[index]
        return HttpResponseRedirect("/prender/%s" % lista_salas)

    prender_sala.short_description = "Prender las maquinas de la sala"


###Tareas
class TareaAdmin(admin.ModelAdmin):
    actions = ['ejecutar_tarea']
    form = FormularioTareas

    def ejecutar_tarea(self, request, queryset):
        seleccionado = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        lista_tareas = ''
        index = 0
        while (index < (len(seleccionado) - 1)):
            lista_tareas += seleccionado[index] + ','
            index += 1
        lista_tareas += seleccionado[index]
        return HttpResponseRedirect("/ejecutar/%s" % lista_tareas)

    ejecutar_tarea.short_description = "Ejecutar la tarea seleccionada"


admin.site.register(Aula, AulaAdmin)
admin.site.register(Tarea, TareaAdmin)
