from django.contrib import admin
from .models import Pedido, DetallePedido

class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 0
    readonly_fields = ['camiseta', 'camiseta_nombre', 'talla', 'version', 'nombre_personalizado', 'numero_personalizado', 'con_short', 'cantidad', 'precio_unitario']

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['codigo_pedido', 'cliente_nombre', 'metodo_pago', 'monto_total', 'estado', 'fecha_creacion']
    list_filter = ['estado', 'metodo_pago', 'fecha_creacion']
    search_fields = ['codigo_pedido', 'cliente_nombre', 'cliente_email', 'operacion_pago']
    readonly_fields = ['codigo_pedido', 'fecha_creacion']
    inlines = [DetallePedidoInline]
    list_editable = ['estado']
