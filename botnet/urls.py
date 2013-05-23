from django.contrib import admin
from django.conf.urls import patterns, include, url

admin.autodiscover()

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
    url(r'^ejecutar/', 'botnet.aula.views.ejecutar', name="ejecutar"),
    url(r'^ejecutar/(?P<lista_de_tareas>[\[,\],\',\w,\s]*)',
             'botnet.aula.views.ejecutar', name="ejecutar"),
    url(r'^mostrar_resultados/', 'botnet.aula.views.mostrar_resultados',
        name="mostrar_resultados"),
    url(r'^mostrar_resultados/(?P<lista_de_salas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.mostrar_resultados', name="mostrar_resultados"),
    url(r'^prender/(?P<listaDeSalas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.prender', name="prender"),
    url(r'^django-rq/', include('django_rq.urls')),
)
