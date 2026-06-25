from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PedidoViewSet, CuponViewSet, NewsletterSubscriberViewSet

router = DefaultRouter()
router.register('pedidos', PedidoViewSet, basename='pedido')
router.register('cupones', CuponViewSet, basename='cupon')
router.register('newsletter', NewsletterSubscriberViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
]

