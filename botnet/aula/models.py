from django.db import models


class Tarea(models.Model):
    nombre = models.CharField(primary_key=True, max_length=50)
    instrucciones = models.CharField(max_length=400)
    archivo = models.FileField('/opt/botnet/botnet/media/', max_length=100)
    ##Algun Archivo

    def __unicode__(self):
        return self.nombre


class Aula(models.Model):
    nombre = models.CharField(primary_key=True,
        max_length=50)
    interfaz = models.CharField(max_length=20)
    maquinaIntermediaria = models.IPAddressField("Maquina Intermediaria")
    red = models.IPAddressField()
    mascara = models.IntegerField()

    def cantidad_computadoras(self):
        computadoras = Computadora.objects.filter(aula=self.nombre)
        return len(computadoras)

    def __unicode__(self):
        return self.nombre

    cantidad_computadoras.short_description = 'Cantidad de computadoras'


class Computadora(models.Model):
    aula = models.ForeignKey(Aula)
    nombre = models.CharField(max_length=50)
    mac = models.CharField(max_length=50)
    ip = models.IPAddressField()

    def __unicode__(self):
        return self.nombre
