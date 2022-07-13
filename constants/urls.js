import {  URLDOMINIO, APIPERU_DOLAR } from './config';

const EXT_PRO = ".php";

const EXT = EXT_PRO;

export const LOGIN_PERSONA = URLDOMINIO + "api/login" + EXT;

export const REGISTER_PERSONA = URLDOMINIO + "api/registrar" + EXT;

export const INGRESOS_PERSONA = URLDOMINIO + "api/ingresos" + EXT;

export const CERT_HABILIDAD_PERSONA = URLDOMINIO + "api/certhabilidad" + EXT;

export const CERT_OBRA_PERSONA = URLDOMINIO + "api/certobra" + EXT;

export const CERT_PROYECTO_PERSONA = URLDOMINIO + "api/certproyecto" + EXT;

export const INFORMACION_PERSONA = URLDOMINIO + "api/informacion" + EXT;

export const PERFIL_PERSONA = URLDOMINIO + "api/perfil" + EXT;

export const OBTENER_PERSONA = URLDOMINIO + "api/getperfil" + EXT;

export const ACTUALIZAR_PERSONA = URLDOMINIO + "api/actperfil" + EXT;

export const VALIDAR_CIP_PERSONA = URLDOMINIO + "api/valcipperfil" + EXT;

export const VALIDAR_TOKEN_PERSONA = URLDOMINIO + "api/valcodperfil" + EXT;

export const VALIDAR_SAVE_PERSONA = URLDOMINIO + "api/valsaveperfil" + EXT;

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
  OBTENER_PERSONA,
  ACTUALIZAR_PERSONA,
  VALIDAR_CIP_PERSONA,
  VALIDAR_TOKEN_PERSONA,
  VALIDAR_SAVE_PERSONA,
  APIPERU_DOLAR,
  DOMINIO
}