# -*- coding: utf-8 -*-
from django.utils import simplejson
from dajaxice.decorators import dajaxice_register


@dajaxice_register
def prueba(request):
    return simplejson.dumps({'message': 'Hello from Python!'})