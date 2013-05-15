from botnet.aula.models import Aula, Computadora, Tarea, Configuracion
from django.contrib import admin
from botnet.aula.forms import FormularioTareas, FormularioAula,\
    FormularioComputadora, FormularioListaTareas
from django.shortcuts import redirect
from botnet import fabfile
from botnet.settings import PATH


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
        return redirect("prender", listDeSalas=lista_salas)

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
        formulario = FormularioListaTareas()
        formulario.tareas = lista_tareas

        return redirect("ejecutar", lista_de_tareas=lista_tareas)

    ejecutar_tarea.short_description = "Ejecutar la tarea seleccionada"


###Configuraciones
class ConfiguracionesAdmin(admin.ModelAdmin):
    actions = ['generar_claves']
    list_display = ('nombre', 'valor')

    def generar_claves(self, request, queryset):
        archivo_por_defecto = PATH + '/clave'
        fabfile.generar_clave(archivo_por_defecto)
        clave = Configuracion(nombre="clave-privada", valor=PATH + '/clave')
        clave.save()

    generar_claves.short_description = "GenerarClaves ssh-todavia no funciona-"

admin.site.register(Aula, AulaAdmin)
admin.site.register(Tarea, TareaAdmin)
admin.site.register(Configuracion, ConfiguracionesAdmin)
