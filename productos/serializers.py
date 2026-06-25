from rest_framework import serializers
from .models import Camiseta, Resena


class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = ['id', 'camiseta', 'nombre_cliente', 'calificacion', 'comentario', 'fecha']


class CamisetaSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(use_url=True, allow_null=True, required=False)
    resenas = ResenaSerializer(many=True, read_only=True)
    promedio_calificacion = serializers.SerializerMethodField()

    class Meta:
        model = Camiseta
        fields = ['id', 'nombre', 'descripcion', 'precio', 'imagen', 'stock', 'categoria', 'resenas', 'promedio_calificacion']

    def get_promedio_calificacion(self, obj):
        resenas = obj.resenas.all()
        if not resenas:
            return 0.0
        total = sum(r.calificacion for r in resenas)
        return round(total / len(resenas), 1)

