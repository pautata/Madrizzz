// components/TermsModal.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal
} from "react-native";

export default function TermsModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Términos y Condiciones de Uso</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.text}>
              Bienvenido a Madrizzz (“la Aplicación”), desarrollada por [Nombre de la Empresa]. Al registrarte y utilizar esta Aplicación, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con alguno de los puntos, te recomendamos no continuar con el registro ni el uso de la Aplicación.
              {"\n\n"}
              1. Introducción{"\n"}
              Bienvenido a Madrizzz (“la Aplicación”), desarrollada por [Nombre de la Empresa]. Al registrarte y utilizar esta Aplicación, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con alguno de los puntos, te recomendamos no continuar con el registro ni el uso de la Aplicación.
              {"\n\n"}
              2. Definiciones{"\n"}
              • Usuario: Toda persona física mayor de 18 años que se registra y utiliza la Aplicación.{"\n"}
              • Contenido: Incluye textos, imágenes, horarios, precios, enlaces y cualquier otro elemento publicado en la Aplicación.{"\n"}
              • Servicios: Funcionalidades de búsqueda, visualización, filtrado, guardado de favoritos y otros ofrecidos por la Aplicación.
              {"\n\n"}
              3. Registro y Cuenta de Usuario{"\n"}
              3.1. Para registrarte necesitas proporcionar un correo electrónico válido, una contraseña segura (mínimo 6 caracteres) y confirmar tu mayoría de edad (18 años o más) mediante tu fecha de nacimiento.{"\n"}
              3.2. Eres responsable de mantener tus credenciales (correo y contraseña) confidenciales. Cualquier actividad realizada con tu cuenta se considerará realizada por ti.{"\n"}
              3.3. Si olvidas tu contraseña, puedes solicitar un enlace de restablecimiento a través de la opción “¿Olvidaste tu contraseña?” en la pantalla de inicio de sesión.
              {"\n\n"}
              4. Uso de la Aplicación{"\n"}
              4.1. La Aplicación te permite explorar planes y actividades en Madrid, filtrarlos por día, hora o precio, y guardar tus favoritos.{"\n"}
              4.2. El contenido (descripciones, precios, horarios, imágenes) se proporciona “tal cual” y puede cambiar sin previo aviso. La Aplicación no garantiza la disponibilidad o exactitud permanente de la información.{"\n"}
              4.3. Queda prohibido utilizar la Aplicación para fines ilegales, spam, reventa comercial sin autorización, extracción automatizada de datos (“scraping”) o cualquier práctica que vaya en contra de la normativa vigente.
              {"\n\n"}
              5. Privacidad y Protección de Datos{"\n"}
              5.1. Al registrarte, aceptas nuestra Política de Privacidad. Recopilamos tu correo electrónico, fecha de nacimiento y la lista de planes que guardes como favoritos.{"\n"}
              5.2. Tus datos se almacenan en Firestore de Firebase bajo tu cuenta personal. Sólo tú y los servicios autorizados de la Aplicación pueden acceder a tu carpeta de favoritos.{"\n"}
              5.3. No compartiremos tu información personal con terceros sin tu consentimiento, salvo requerimiento legal o judicial.
              {"\n\n"}
              6. Derechos de Propiedad Intelectual{"\n"}
              6.1. Todos los derechos de la Aplicación, su código fuente, diseño, marcas, logotipos y contenido original (“Material de la Aplicación”) pertenecen a [Nombre de la Empresa].{"\n"}
              6.2. Queda prohibida la reproducción, distribución, modificación o uso comercial de cualquier Material de la Aplicación sin autorización expresa por escrito.
              {"\n\n"}
              7. Responsabilidades y Limitación de Responsabilidad{"\n"}
              7.1. La Aplicación no es responsable de daños derivados de errores en la información proporcionada (precios, horarios, enlaces externos).{"\n"}
              7.2. No garantizamos que la Aplicación esté libre de virus o interrupciones. Tu uso es bajo tu propio riesgo.{"\n"}
              7.3. En ningún caso la responsabilidad total por daños directos o indirectos excederá el importe que hayas pagado (si aplica) por el uso de la Aplicación o, en su defecto, 50 €.
              {"\n\n"}
              8. Enlaces a Terceros{"\n"}
              8.1. Algunos planes incluyen enlaces a sitios web externos (por ejemplo, páginas oficiales de eventos). No controlamos ni somos responsables del contenido, seguridad o privacidad de esos sitios.{"\n"}
              8.2. Hacer clic en un enlace externo implica aceptar sus propias políticas de uso y privacidad.
              {"\n\n"}
              9. Modificaciones de los Términos{"\n"}
              9.1. Podemos actualizar estos Términos y Condiciones periódicamente. La versión vigente siempre estará disponible dentro de la Aplicación.{"\n"}
              9.2. Te notificaremos mediante la pantalla principal de la Aplicación o tu correo electrónico cada vez que haya cambios sustanciales. Continuar usando la Aplicación después de la actualización significa que aceptas la nueva versión.
              {"\n\n"}
              10. Terminación de la Cuenta{"\n"}
              10.1. Puedes solicitar la eliminación de tu cuenta en cualquier momento contactándonos a través del correo soporte@madrizzz.com.{"\n"}
              10.2. Nos reservamos el derecho de suspender o cancelar tu cuenta si detectamos comportamientos fraudulentos, violaciones a estos Términos o actividades ilegales.
              {"\n\n"}
              11. Legislación Aplicable y Jurisdicción{"\n"}
              11.1. Estos Términos se rigen por la legislación española.{"\n"}
              11.2. Para cualquier controversia, las partes se someten a la jurisdicción de los juzgados y tribunales de la ciudad de Madrid, renunciando a cualquier otro fuero.
              {"\n\n"}
              12. Contacto{"\n"}
              Si tienes dudas o comentarios sobre estos Términos y Condiciones, puedes escribirnos a:{"\n"}
              • Correo electrónico: soporte@madrizzz.com{"\n"}
              • Dirección postal: Calle Ejemplo, 123, 28001 Madrid, España.
              {"\n\n"}
              Al pulsar “Cerrar” y continuar con el registro o el uso de la Aplicación, confirmas que has leído, entendido y aceptado estos Términos y Condiciones de Uso.
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.btnClose}>
            <Text style={styles.btnCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  scroll: {
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  btnClose: {
    backgroundColor: "#64EDCC",
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  btnCloseText: {
    color: "white",
    fontWeight: "bold",
  },
});
