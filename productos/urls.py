from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CamisetaViewSet, ResenaViewSet

router = DefaultRouter()
router.register('camisetas', CamisetaViewSet, basename='camiseta')
router.register('resenas', ResenaViewSet, basename='resena')

urlpatterns = [
    path('', include(router.urls)),
]

