from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CamisetaViewSet

router = DefaultRouter()
router.register('camisetas', CamisetaViewSet, basename='camiseta')

urlpatterns = [
    path('', include(router.urls)),
]
