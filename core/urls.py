from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # 1. Redirección automática al entrar al link
    path('', lambda request: redirect('admin/', permanent=False)),
    
    # 2. El Panel de Admin (ruta estándar)
    path('admin/', admin.site.urls),
    
    # 3. Tu API para React
    path('api/', include('productos.urls')),
] 

# 4. Para que se vean las FOTOS que subas
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
