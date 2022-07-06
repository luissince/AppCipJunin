/**
 * DOMINIO PARA PRODUCCION HTTP
 */
const DOMINIO_PRO_HTTPS = "https://www.intranet.cip-junin.org.pe/app/";

/** 
 * DOMINIO PARA PRUEBAS
 */
const DOMINIO_PRU = "http://192.168.0.108/WebCipJunin/app/";

/** 
 * API PERU DOLAR
 */
const APIPERU_DOLAR = "https://api.apis.net.pe/v1/tipo-cambio-sunat";

/**
 * EXTECIÓN PARA USO EN PRODUCCIÓN
 */

const EXT_PRO = ".php";

const EXT_DEV = "";

const EXT = EXT_PRO;

const URLDOMINIO = DOMINIO_PRO_HTTPS;

export const LOGIN_PERSONA = URLDOMINIO + "api/login" + EXT;

export const REGISTER_PERSONA = URLDOMINIO + "api/registrar" + EXT;

export const INGRESOS_PERSONA = URLDOMINIO + "api/ingresos" + EXT;

export const CERT_HABILIDAD_PERSONA = URLDOMINIO + "api/certhabilidad" + EXT;

export const CERT_OBRA_PERSONA = URLDOMINIO + "api/certobra" + EXT;

export const CERT_PROYECTO_PERSONA = URLDOMINIO + "api/certproyecto" + EXT;

export const INFORMACION_PERSONA = URLDOMINIO + "api/informacion" + EXT;

export const PERFIL_PERSONA = URLDOMINIO + "api/perfil" + EXT;

export const PAGOS_CUOTAS = URLDOMINIO + "api/cuotas" + EXT;

export const PAGOS_CERTHABILIDAD = URLDOMINIO + "api/certhabilidading" + EXT;

export const REGISTRAR_PAGO = URLDOMINIO + "api/culqi/payment" + EXT;

export const INFORMACION_COLEGIO = URLDOMINIO + "api/colegio" + EXT;

export const LISTA_COMPROBANTES = URLDOMINIO + "api/comprobantes" + EXT;

export const DOMINIO = URLDOMINIO;

export default {
  LOGIN_PERSONA,
  REGISTER_PERSONA,
  INGRESOS_PERSONA,
  INFORMACION_PERSONA,
  PERFIL_PERSONA,
  PAGOS_CUOTAS,
  PAGOS_CERTHABILIDAD,
  REGISTRAR_PAGO,
  CERT_HABILIDAD_PERSONA,
  CERT_OBRA_PERSONA,
  CERT_PROYECTO_PERSONA,
  INFORMACION_COLEGIO,
  LISTA_COMPROBANTES,
  APIPERU_DOLAR,
  DOMINIO
}