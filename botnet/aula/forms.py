from django import forms
from botnet.aula.models import Aula, Tarea
from django.core.validators import validate_ipv4_address
import re


class FormularioEjecutar(forms.Form):
    salas = Aula.objects.all()
    opciones = [(each, each) for each in salas]
    aulas = forms.ChoiceField(choices=opciones)
    tareas = forms.CharField(widget=forms.HiddenInput())


class FormularioTareas(forms.ModelForm):
    instrucciones = forms.CharField(widget=forms.Textarea)

    def clean_instrucciones(self):
        # do something that validates your data
        datos = re.sub('\r', '', self.cleaned_data["instrucciones"])
        return datos

    class Meta:
        model = Tarea


class FormularioAula(forms.ModelForm):
    maquina_intermediaria = forms.IPAddressField(label='Maquina Intermediaria',
        validators=[validate_ipv4_address])
    red = forms.IPAddressField(validators=[validate_ipv4_address])


class FormularioComputadora(forms.ModelForm):
    ip = forms.IPAddressField(label='ip', validators=[validate_ipv4_address])
