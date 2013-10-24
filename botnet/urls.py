from django.contrib import admin
from django.conf.urls import patterns, include, url
admin.autodiscover()

urlpatterns = patterns('',
#    url(r'^$', 'botnet.djbot.views.indice', name="indice"),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^mostrar_resultados/', 'botnet.djbot.views.mostrar_resultados',
        name="mostrar_resultados"),
    url(r'^prender/(?P<listaDeSalas>[\[,\],\',\w,\s]*)',
        'botnet.djbot.views.prender', name="prender"),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login', name="login"),
    url(r'^django-rq/', include('django_rq.urls')),
)
