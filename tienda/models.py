from django.db import models
from productos.models import Camiseta

class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente de verificación'),
        ('pagado', 'Pagado / Verificado'),
        ('enviado', 'Enviado'),
        ('cancelado', 'Cancelado'),
    ]

    codigo_pedido = models.CharField(max_length=50, unique=True)
    cliente_nombre = models.CharField(max_length=255)
    cliente_email = models.EmailField()
    cliente_telefono = models.CharField(max_length=50)
    cliente_direccion = models.CharField(max_length=255, blank=True)
    
    metodo_pago = models.CharField(max_length=50)  # yape, plin, transferencia
    titular_pago = models.CharField(max_length=255)
    operacion_pago = models.CharField(max_length=100)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.codigo_pedido} - {self.cliente_nombre}"

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='detalles', on_delete=models.CASCADE)
    camiseta = models.ForeignKey(Camiseta, on_delete=models.SET_NULL, null=True, blank=True)
    camiseta_nombre = models.CharField(max_length=255)  # Respaldo en caso de que se borre el producto
    talla = models.CharField(max_length=10)
    version = models.CharField(max_length=50)
    nombre_personalizado = models.CharField(max_length=100, blank=True, default='')
    numero_personalizado = models.CharField(max_length=10, blank=True, default='')
    con_short = models.BooleanField(default=False)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad}x {self.camiseta_nombre} ({self.talla}) en {self.pedido.codigo_pedido}"

class Cupon(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    descuento_porcentaje = models.PositiveIntegerField(default=10)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.codigo} ({self.descuento_porcentaje}%)"

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

