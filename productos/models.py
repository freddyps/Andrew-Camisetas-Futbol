from django.db import models

class Camiseta(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='camisetas/', null=True, blank=True)
    stock = models.IntegerField(default=0)
    categoria = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return self.nombre

class Resena(models.Model):
    camiseta = models.ForeignKey(Camiseta, related_name='resenas', on_delete=models.CASCADE)
    nombre_cliente = models.CharField(max_length=100)
    calificacion = models.PositiveIntegerField(default=5)  # 1-5 estrellas
    comentario = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre_cliente} - {self.calificacion}* en {self.camiseta.nombre}"

