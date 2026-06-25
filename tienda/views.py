from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Pedido, Cupon, NewsletterSubscriber
from .serializers import PedidoSerializer, CuponSerializer, NewsletterSubscriberSerializer
from .utils import enviar_notificacion_whatsapp_admin

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().prefetch_related('detalles')
    serializer_class = PedidoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Guardar pedido usando transacción atómica para asegurar la consistencia del stock
        with transaction.atomic():
            pedido = serializer.save()
            
        # Enviar notificación WhatsApp
        try:
            enviar_notificacion_whatsapp_admin(pedido)
        except Exception as e:
            # No queremos bloquear la creación del pedido en DB si falla el envío de WhatsApp
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error al enviar notificación WhatsApp: {str(e)}")
            
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'], url_path='tracking/(?P<codigo>[^/.]+)')
    def tracking(self, request, codigo=None):
        try:
            pedido = Pedido.objects.prefetch_related('detalles').get(codigo_pedido=codigo)
            serializer = self.get_serializer(pedido)
            return Response(serializer.data)
        except Pedido.DoesNotExist:
            return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class CuponViewSet(viewsets.ModelViewSet):
    queryset = Cupon.objects.all()
    serializer_class = CuponSerializer

    @action(detail=False, methods=['post'])
    def validar(self, request):
        codigo = request.data.get('codigo', '').strip().upper()
        try:
            cupon = Cupon.objects.get(codigo=codigo, activo=True)
            return Response({
                'valido': True,
                'codigo': cupon.codigo,
                'descuento_porcentaje': cupon.descuento_porcentaje
            })
        except Cupon.DoesNotExist:
            return Response({
                'valido': False,
                'error': 'Cupón inválido o inactivo'
            }, status=status.HTTP_400_BAD_REQUEST)

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer

