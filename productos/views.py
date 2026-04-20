from rest_framework import viewsets
from .models import Camiseta
from .serializers import CamisetaSerializer

class CamisetaViewSet(viewsets.ModelViewSet):
    queryset = Camiseta.objects.all()
    serializer_class = CamisetaSerializer
