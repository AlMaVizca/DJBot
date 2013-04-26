from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
    url(r'^ejecutar/(?P<listaDeTareas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.ejecutar'),
    url(r'^prender/(?P<listaDeSalas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.prender'),
    url(r'^ejecutando/$', 'botnet.aula.views.ejecutando'),
)
