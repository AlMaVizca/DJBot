from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
    #(?P<listaDeTareas>[\[,\],\',\w,\s]*)
    url(r'^ejecutar/(?P<listaDeTareas>[\[,\],\',\w,\s]*)',
             'botnet.aula.views.ejecutar', name="ejecutar"),
    url(r'^prender/(?P<listaDeSalas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.prender', name="prender"),
    url(r'^ejecutando/$', 'botnet.aula.views.ejecutando', name="ejecutado"),
    url(r'^django-rq/', include('django_rq.urls')),
)
