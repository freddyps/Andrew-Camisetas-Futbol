from rest_framework import serializers
from .models import Pedido, DetallePedido, Cupon, NewsletterSubscriber
from productos.models import Camiseta

class DetallePedidoSerializer(serializers.ModelSerializer):
    camiseta_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = DetallePedido
        fields = [
            'id', 'camiseta', 'camiseta_id', 'camiseta_nombre', 'talla', 'version', 
            'nombre_personalizado', 'numero_personalizado', 'con_short', 
            'cantidad', 'precio_unitario'
        ]

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'codigo_pedido', 'cliente_nombre', 'cliente_email', 
            'cliente_telefono', 'cliente_direccion', 'metodo_pago', 
            'titular_pago', 'operacion_pago', 'monto_total', 
            'estado', 'fecha_creacion', 'detalles'
        ]
        read_only_fields = ['codigo_pedido', 'estado', 'fecha_creacion']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        
        # Generar un código único
        import time
        import random
        timestamp = str(int(time.time()))[-5:]
        rand = random.randint(10, 99)
        codigo = f"AC-{timestamp}{rand}"
        
        pedido = Pedido.objects.create(codigo_pedido=codigo, **validated_data)
        
        for detalle_data in detalles_data:
            camiseta_id = detalle_data.pop('camiseta_id', None)
            camiseta = None
            if camiseta_id:
                try:
                    camiseta = Camiseta.objects.get(id=camiseta_id)
                except Camiseta.DoesNotExist:
                    pass
            
            detalle = DetallePedido.objects.create(pedido=pedido, camiseta=camiseta, **detalle_data)
            
            # Descontar stock
            if camiseta:
                cantidad = detalle_data.get('cantidad', 1)
                camiseta.stock = max(0, camiseta.stock - cantidad)
                camiseta.save()
                
        return pedido

class CuponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cupon
        fields = ['id', 'codigo', 'descuento_porcentaje', 'activo']

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'fecha_registro']

