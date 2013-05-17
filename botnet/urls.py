from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
    url(r'^ejecutar/(?P<lista_de_tareas>[\[,\],\',\w,\s]*)',
             'botnet.aula.views.ejecutar', name="ejecutar"),
    url(r'^ejecutar/', 'botnet.aula.views.ejecutar', name="ejecutar"),
    url(r'^prender/(?P<listaDeSalas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.prender', name="prender"),
    url(r'^django-rq/', include('django_rq.urls')),
)
