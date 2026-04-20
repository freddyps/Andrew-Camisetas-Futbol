from rest_framework import serializers
from .models import Camiseta


class CamisetaSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(use_url=True, allow_null=True, required=False)

    class Meta:
        model = Camiseta
        fields = ['id', 'nombre', 'descripcion', 'precio', 'imagen', 'stock', 'categoria']
