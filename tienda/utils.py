import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

def enviar_notificacion_whatsapp_admin(pedido):
    """
    Formatea los detalles del pedido y envía una notificación al WhatsApp del administrador.
    Si hay credenciales de Twilio configuradas, las envía a través de su API.
    De lo contrario, hace un fallback registrando la notificación detalladamente en la consola.
    """
    # 1. Formatear el mensaje
    detalles_str = ""
    for idx, item in enumerate(pedido.detalles.all(), 1):
        personalizado = ""
        if item.nombre_personalizado or item.numero_personalizado:
            personalizado = f" (Nom: {item.nombre_personalizado}, Num: {item.numero_personalizado})"
        short = " + Short" if item.con_short else ""
        detalles_str += f"\n👉 {item.cantidad}x {item.camiseta_nombre} - Talla {item.talla} ({item.version}{short}){personalizado}"

    mensaje = (
        f"🔥 *NUEVO PEDIDO RECIBIDO* 🔥\n\n"
        f"📌 *Código:* {pedido.codigo_pedido}\n"
        f"👤 *Cliente:* {pedido.cliente_nombre}\n"
        f"📧 *Email:* {pedido.cliente_email}\n"
        f"📞 *WhatsApp:* {pedido.cliente_telefono}\n"
        f"🏠 *Dirección:* {pedido.cliente_direccion or 'No especificada'}\n\n"
        f"💵 *Monto:* S/ {pedido.monto_total}\n"
        f"💳 *Pago:* {pedido.metodo_pago.upper()}\n"
        f"👤 *Titular Pago:* {pedido.titular_pago}\n"
        f"🔢 *Operación:* {pedido.operacion_pago}\n\n"
        f"👕 *Detalles:* {detalles_str}\n\n"
        f"⚙️ *Estado:* {pedido.get_estado_display()}"
    )

    # 2. Intentar enviar mediante Twilio WhatsApp API
    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
    from_number = getattr(settings, 'TWILIO_FROM_WHATSAPP', None)
    admin_number = getattr(settings, 'WHATSAPP_ADMIN_NUMBER', None)

    # Asegurarnos de que los números tengan formato whatsapp:
    if from_number and not from_number.startswith('whatsapp:'):
        from_number = f"whatsapp:{from_number}"
    
    if admin_number and not admin_number.startswith('whatsapp:'):
        to_number = f"whatsapp:{admin_number}"
    else:
        to_number = admin_number

    if account_sid and auth_token and from_number and to_number:
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
            payload = {
                'From': from_number,
                'To': to_number,
                'Body': mensaje
            }
            response = requests.post(url, data=payload, auth=(account_sid, auth_token), timeout=10)
            if response.status_code in [200, 201]:
                logger.info(f"✅ Notificación WhatsApp automática enviada a {to_number} (SID: {response.json().get('sid')})")
                return True
            else:
                logger.error(f"❌ Error al enviar WhatsApp vía Twilio. Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            logger.error(f"❌ Excepción al intentar enviar WhatsApp vía Twilio: {str(e)}")
    
    # 3. Fallback: Log a la consola para demostración en desarrollo "como si fuera real"
    try:
        print("\n" + "="*50)
        print("📢 [NOTIFICACIÓN DE WHATSAPP AUTOMÁTICA EN SERVIDOR]")
        print(f"Para: {admin_number or '+51934353097'}")
        print("-"*50)
        print(mensaje)
        print("="*50 + "\n")
    except UnicodeEncodeError:
        # Fallback para consolas Windows que no soportan emojis UTF-8 en print()
        safe_message = mensaje.encode('ascii', errors='ignore').decode('ascii')
        print("\n" + "="*50)
        print("[NOTIFICACION DE WHATSAPP AUTOMATICA EN SERVIDOR]")
        print(f"Para: {admin_number or '+51934353097'}")
        print("-"*50)
        print(safe_message)
        print("="*50 + "\n")
    logger.info("ℹ️ Mensaje de WhatsApp impreso en consola (modo de desarrollo o credenciales ausentes).")
    return False

