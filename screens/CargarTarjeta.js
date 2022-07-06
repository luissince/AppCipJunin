import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { fetch_timeout, formatMoney } from "./tools/Tools";
import { COLORS, SIZES, icons, FONTS, URL } from '../constants';
import { connect } from 'react-redux';

class CargarTarjeta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dolar: 0,
            montoTotal: 0,
            cuotasInicio: "",
            cuotasFin: ""
        }
        this.props.navigation.setOptions({
            title: 'Cargar Tarjetas',
            headerTitle: 'Cargar Tarjetas',
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
            }
        });
    }

    componentDidMount() {
        this.loadPrecioDolar();
    }

    async loadPrecioDolar() {
        try {
            this.setState({ isLoading: true });
            let result = await fetch_timeout(URL.APIPERU_DOLAR);
            if (result.state == 0) {
                this.setState({ dolar: 0, isLoading: false });
            } else {
                this.setState({ dolar: result.venta == null ? 0 : result.venta, isLoading: false });
            }
        } catch (error) {
            this.setState({ isLoading: false });
        }
    }

    onEventNuevaTarjeta() {
        if (this.state.dolar <= 0) {
            Alert.alert("Alerta", "No se puede continuar con el proceso, intente nuevamente en un par de minutos.")
        } else {
            if (this.props.route.params.tipo == 1) {
                this.props.navigation.navigate('CrediCars',
                    {
                        "tipo": this.props.route.params.tipo,
                        "monto": this.props.route.params.monto,
                        "cuotas": this.props.route.params.cuotas,
                        "dolar": this.state.dolar
                    });
            } else {
                this.props.navigation.navigate('CrediCars',
                    {
                        "tipo": this.props.route.params.tipo,
                        "monto": this.props.route.params.monto,
                        "cuotas": this.props.route.params.cuotas,
                        "dolar": this.state.dolar,
                        "objectCertificadoHabilidad": this.props.route.params.objectCertificadoHabilidad
                    });
            }
        }
    }

    onValidateCardSelect(item) {
        if (this.state.dolar <= 0) {
            Alert.alert("Alerta", "No se puede continuar con el proceso, intente nuevamente en un par de minutos.")
        } else {
            let array = item.expiration.split("/");

            if (this.props.route.params.tipo == 1) {
                const { total, cuotasInicio, cuotasFin } = this.onEventGeneratePay(1);
                this.setState({
                    montoTotal: total,
                    cuotasInicio: cuotasInicio,
                    cuotasFin: cuotasFin
                }, () => {
                    this.props.navigation.navigate('DocumentoPago',
                        {
                            "tipo": this.props.route.params.tipo,
                            "card_number": item.card_number,
                            "cvv": item.cvv,
                            "expiration_month": array[0],
                            "expiration_year": array[1],
                            "email": item.email,
                            "monto": formatMoney(this.state.montoTotal),
                            "cuotas": this.props.route.params.cuotas,
                            "cuotasInicio": this.state.cuotasInicio,
                            "cuotasFin": this.state.cuotasFin
                        });
                });
            } else {
                const { total } = this.onEventGeneratePay(2);
                this.setState({
                    montoTotal: total
                }, () => {
                    this.props.navigation.navigate('DocumentoPago',
                        {
                            "tipo": this.props.route.params.tipo,
                            "card_number": item.card_number,
                            "cvv": item.cvv,
                            "expiration_month": array[0],
                            "expiration_year": array[1],
                            "email": item.email,
                            "monto": formatMoney(this.state.montoTotal),
                            "cuotas": this.props.route.params.cuotas,
                            "objectCertificadoHabilidad": this.props.route.params.objectCertificadoHabilidad
                        });
                });
            }
        }
    }

    onEventGeneratePay(tipo) {
        let data = this.props.route.params.cuotas;
        let monto = 0;
        for (let item of data) {
            for (let c of item.concepto) {
                monto += parseFloat(c.Precio);
            }
        }
        let montoTotal = 0;
        montoTotal += parseFloat(monto);

        let montoAum =
            montoTotal > 0 && montoTotal <= 50 ?
                0.75 :
                montoTotal > 50 && montoTotal <= 100 ?
                    1.25 :
                    montoTotal > 100 && montoTotal <= 200 ?
                        1.75 :
                        montoTotal > 200 && montoTotal <= 400 ?
                            2.25 :
                            montoTotal > 400 && montoTotal <= 600 ?
                                2.75 :
                                montoTotal > 600 && montoTotal <= 800 ?
                                    3.25 :
                                    montoTotal > 800 && montoTotal <= 1000 ?
                                        3.75 :
                                        montoTotal > 1000 && montoTotal <= 1200 ?
                                            4.25 :
                                            montoTotal > 1200 && montoTotal <= 1400 ?
                                                4.75 :
                                                montoTotal > 1400 && montoTotal <= 1600 ?
                                                    5.25 :
                                                    montoTotal > 1600 && montoTotal <= 1800 ?
                                                        5.75 :
                                                        montoTotal > 1800 && montoTotal <= 2000 ?
                                                            6.25 :
                                                            montoTotal > 2000 && montoTotal <= 2200 ?
                                                                6.75 :
                                                                0;

        let igvp = 18;
        let comision_varible = 4.20;
        let comision_fija = 0.30;
        let dolar = this.state.dolar;

        let monto_depositar = montoTotal - ((((montoTotal * (comision_varible / 100)) + (comision_fija * dolar)) * (igvp / 100)) + ((montoTotal * (comision_varible / 100)) + (comision_fija * dolar)));
        let monto_cobrar = montoTotal + ((montoTotal - monto_depositar) + montoAum);

        let total = Math.round(monto_cobrar);

        let cuotasInicio = tipo == 1 ? data[0].year + "-" + data[0].mes + "-" + data[0].day : "";
        let cuotasFin = tipo == 1 ? data[data.length - 1].year + "-" + data[data.length - 1].mes + "-" + data[data.length - 1].day : "";
        return { total, cuotasInicio, cuotasFin }
    }


    render() {
        return (
            <SafeAreaView style={styles.safeAreaView} >
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            source={icons.pay}
                            resizeMode='contain'
                            style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Tarjetas Registradas
                        </Text>
                    </View>
                </View>

                {
                    this.state.isLoading ?
                        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
                            <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                    <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>Cargando datos...</Text>
                                </View>
                            </View>
                        </View>
                        : null
                }

                <View style={{ flex: 1, paddingVertical: 10, }}>
                    <ScrollView keyboardShouldPersistTaps='handled'>

                        <View style={{ paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding }}>
                            <View
                                style={{
                                    backgroundColor: COLORS.green,
                                    borderRadius: 6,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,
                                    elevation: 1,
                                }}>
                                <TouchableOpacity
                                    onPress={() => this.onEventNuevaTarjeta()}
                                    style={{
                                        padding: 10,
                                        flexDirection: 'row',
                                    }}>
                                    <Image
                                        source={icons.addcard}
                                        resizeMode='contain'
                                        style={{ width: 24, height: 24, tintColor: COLORS.white }} />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, paddingHorizontal: 5 }}>AGREGAR NUEVA TARJETA</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ padding: SIZES.padding }}>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={icons.start}
                                    resizeMode='contain'
                                    style={{ width: 24, height: 24, tintColor: COLORS.blue }} />
                                <Text style={{ ...FONTS.h4, color: COLORS.blue, paddingHorizontal: 5 }}>FAVORITOS</Text>
                            </View>
                            {
                                this.props.token.crediCard.length !== 0 ?
                                    <View
                                        style={{
                                            backgroundColor: COLORS.white,
                                            borderRadius: 6,
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.18,
                                            shadowRadius: 1.00,
                                            elevation: 1,
                                        }}>
                                        {
                                            this.props.token.crediCard.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => this.onValidateCardSelect(item)}
                                                        style={{ padding: 10, borderBottomColor: '#C0CAD0', borderBottomWidth: this.props.token.crediCard.length - 1 == index ? 0 : 1 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ width: '80%' }}>
                                                                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>{item.name}</Text>
                                                                <Text style={{ ...FONTS.h5, color: COLORS.grayLight }}>{item.card_number}</Text>
                                                            </View>
                                                            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                                                                <TouchableOpacity>
                                                                    <Image
                                                                        source={icons.remove}
                                                                        resizeMode='contain'
                                                                        style={{ width: 20, height: 20, tintColor: COLORS.grayDark }} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    :
                                    null
                            }

                        </View>

                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: COLORS.lightGray
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

export default connect(mapStateToProps)(CargarTarjeta);