from rest_framework import viewsets
from .models import Camiseta, Resena
from .serializers import CamisetaSerializer, ResenaSerializer

class CamisetaViewSet(viewsets.ModelViewSet):
    queryset = Camiseta.objects.all().prefetch_related('resenas')
    serializer_class = CamisetaSerializer

class ResenaViewSet(viewsets.ModelViewSet):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer

