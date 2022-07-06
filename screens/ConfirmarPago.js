import React from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView, Image, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, icons, FONTS, URL } from '../constants';
import { getDateFormaMMYY } from "./tools/Tools";
import { connect } from 'react-redux';

class ConfirmarPago extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            arrayIngresos: [],
            token: JSON.parse(this.props.token.userToken),
        }
        this.ingresos = [];
        this.props.navigation.setOptions({
            title: 'Confirmar Pago',
            headerTitle: 'Confirmar Pago',
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleAlign: 'center',
            headerTitleStyle: {
                ...FONTS.h3,
                fontWeight: 'bold',
                textAlignVertical: 'center',
                flex: 1,
            },
        });
    }

    componentDidMount() {

    }

    promisedSetState(newState) {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                resolve()
            });
        });
    }

    validateDuplicate(idConcepto) {
        let ret = false;
        for (let i = 0; i < this.ingresos.length; i++) {
            if (this.ingresos[i].idConcepto === parseInt(idConcepto)) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    async onEventConfirmarPago() {
        this.setState({ isLoading: true });
        try {
            this.ingresos = [];
            for (let value of this.props.route.params.cuotas) {
                for (let c of value.concepto) {
                    if (!this.validateDuplicate(c.IdConcepto)) {
                        this.ingresos.push({
                            idConcepto: parseInt(c.IdConcepto),
                            categoria: parseInt(c.Categoria),
                            cantidad: 1,
                            concepto: c.Concepto,
                            precio: parseFloat(c.Precio),
                            monto: parseFloat(c.Precio),
                        });
                    } else {
                        for (let i = 0; i < this.ingresos.length; i++) {
                            if (this.ingresos[i].idConcepto == c.IdConcepto) {
                                let newConcepto = this.ingresos[i];
                                newConcepto.categoria = parseInt(c.Categoria);
                                newConcepto.cantidad = newConcepto.cantidad + 1;
                                newConcepto.precio = c.Precio;
                                newConcepto.monto =
                                    parseFloat(newConcepto.precio) *
                                    parseFloat(newConcepto.cantidad);
                                this.ingresos[i] = newConcepto;
                                break;
                            }

                        }
                    }
                }
            }


            await this.promisedSetState({ arrayIngresos: this.ingresos });

            let response = await fetch(URL.REGISTRAR_PAGO, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: this.props.route.params.tipo == 1 ? JSON.stringify({
                    "idTipoDocumento": this.props.route.params.idTipoDocumento,
                    "idPersona": this.state.token.idDNI,
                    "empresa": this.props.route.params.empresa,
                    "idUsuario": -1,
                    "estado": 'C',
                    "tipo": 3,
                    "idBanco": 0,
                    "numOperacion": '',
                    "descripcion": '',
                    "estadoCuotas": true,
                    "estadoCertificadoHabilidad": false,
                    "objectCertificadoHabilidad": {},
                    "ingresos": this.state.arrayIngresos,
                    "cuotasInicio": this.props.route.params.cuotasInicio,
                    "cuotasFin": this.props.route.params.cuotasFin,
                    "card_number": this.props.route.params.card_number,
                    "cvv": this.props.route.params.cvv,
                    "expiration_month": this.props.route.params.expiration_month,
                    "expiration_year": this.props.route.params.expiration_year,
                    "email": this.props.route.params.email,
                    "monto": this.props.route.params.monto
                }) : JSON.stringify({
                    "idTipoDocumento": this.props.route.params.idTipoDocumento,
                    "idPersona": this.state.token.idDNI,
                    "empresa": this.props.route.params.empresa,
                    "idUsuario": -1,
                    "estado": 'C',
                    "tipo": 3,
                    "idBanco": 0,
                    "numOperacion": '',
                    "descripcion": '',
                    "estadoCuotas": false,
                    "estadoCertificadoHabilidad": true,
                    "objectCertificadoHabilidad": this.props.route.params.objectCertificadoHabilidad,
                    "ingresos": this.state.arrayIngresos,
                    "card_number": this.props.route.params.card_number,
                    "cvv": this.props.route.params.cvv,
                    "expiration_month": this.props.route.params.expiration_month,
                    "expiration_year": this.props.route.params.expiration_year,
                    "email": this.props.route.params.email,
                    "monto": this.props.route.params.monto
                })
            });

            let result = await response.json();
            if (result.state == 1) {
                this.props.navigation.navigate('RespuestaPago', {
                    "state": 1,
                    "message": result.message,
                    "monto": this.props.route.params.monto
                });
                this.setState({ isLoading: false });
            } else {
                this.props.navigation.navigate('RespuestaPago', {
                    "state": 0,
                    "message": result.message,
                    "monto": 0
                });
                this.setState({ isLoading: false });
            }
        } catch (error) {
            this.props.navigation.navigate('RespuestaPago', {
                "state": 0,
                "message": "Error de conexión del cliente, intente nuevamente en un par de minutos.",
                "monto": 0
            });
            this.setState({ isLoading: false });
        }
    }

    onEventCancelarPago = () => {
        this.props.navigation.navigate('Servicios');
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            source={icons.pay}
                            resizeMode='contain'
                            style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Validar Información
                        </Text>
                    </View>
                </View>

                {
                    this.state.isLoading ?
                        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
                            <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                    <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>Procesando Transacción...</Text>
                                </View>
                            </View>
                        </View>
                        : null
                }

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    }}>
                        <View style={{
                            backgroundColor: COLORS.white,
                            borderRadius: SIZES.radius,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            elevation: 3,
                        }}>
                            <View style={{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, padding: 10, }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>{this.props.route.params.tipo == 1 ? "Pago de cuotas" : "Certificado de Habilidad"}</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>{this.props.route.params.tipo == 1 ? "DEL " + getDateFormaMMYY(this.props.route.params.cuotasInicio) + " AL " + getDateFormaMMYY(this.props.route.params.cuotasFin) : "-"}</Text>
                            </View>
                            <View style={{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, padding: 10 }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Tarjeta</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>{this.props.route.params.card_number}</Text>
                            </View>
                            <View style={{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, padding: 10 }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Expiración</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>{this.props.route.params.expiration_month}/{this.props.route.params.expiration_year}</Text>
                            </View>
                            <View style={{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, padding: 10 }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>CVC/CCV</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>{this.props.route.params.cvv}</Text>
                            </View>
                            <View style={{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, padding: 10 }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Email</Text>
                                <Text style={{ ...FONTS.h3, color: COLORS.secondary }}>{this.props.route.params.email}</Text>
                            </View>
                            <View style={{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, padding: 10 }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Monto</Text>
                                <Text style={{ ...FONTS.h2, color: COLORS.green }}>S/ {this.props.route.params.monto}</Text>
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text>Verifique sus datos antes de continuar; una ves realizado el pago, anularlo toma varios días.</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', backgroundColor: COLORS.primary, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}
                                onPress={this.onEventCancelarPago}>
                                <Image
                                    source={icons.minus}
                                    style={{
                                        width: 16,
                                        height: 16,
                                        margin: 5,
                                        tintColor: COLORS.white,
                                        resizeMode: 'stretch',
                                    }}
                                />
                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', backgroundColor: COLORS.green, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}
                                onPress={() => { this.onEventConfirmarPago() }}>
                                <Image
                                    source={icons.plus}
                                    style={{
                                        width: 16,
                                        height: 16,
                                        margin: 5,
                                        tintColor: COLORS.white,
                                        resizeMode: 'stretch',
                                    }}
                                />
                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

            </SafeAreaView >
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,

    },
    contenedorTitulo: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
});

const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}

export default connect(mapStateToProps)(ConfirmarPago);


