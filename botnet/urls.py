from django.contrib import admin
from django.conf.urls import patterns, include, url
admin.autodiscover()

#from dajaxice.core import dajaxice_autodiscover, dajaxice_config
#dajaxice_autodiscover()


urlpatterns = patterns('',
    url(r'^$', 'botnet.aula.views.indice', name="indice"),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^mostrar_resultados/', 'botnet.aula.views.mostrar_resultados',
        name="mostrar_resultados"),
    url(r'^prender/(?P<listaDeSalas>[\[,\],\',\w,\s]*)',
        'botnet.aula.views.prender', name="prender"),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login', name="login"),
    #url(dajaxice_config.dajaxice_url, include('dajaxice.urls')),
    url(r'^django-rq/', include('django_rq.urls')),
)
