import React from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { COLORS, icons, FONTS, SIZES } from '../constants';
import { formatMoney, validateEmail } from "./tools/Tools";
import { connect } from 'react-redux';
import { CreditCardInput } from "./components/credicard";
import { addCard } from '../screens/actions/persona';

class CrediCars extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCredicars: null,
            isVisibleNumber: true,
            isVisibleExpiry: false,
            isVisibleCvc: false,
            isVisibleName: false,
            isCompletePay: false,
            isFocus: false,
            guardarTarjeta: false,
            montoTotal: 0,
            cuotasInicio: "",
            cuotasFin: "",
            email: this.props.token.email
        }
        this.txtEmail = React.createRef();

        this.props.navigation.setOptions({
            title: 'Registrar Tarjeta',
            headerTitle: 'Registrar Tarjeta',
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

    onEventLeft = () => {
        if (this.state.dataCredicars != null) {
            if (this.state.isVisibleExpiry) {
                this.setState({ isVisibleExpiry: false, isVisibleCvc: false, isVisibleName: false, isCompletePay: false, isVisibleNumber: true });
            } else if (this.state.isVisibleCvc) {
                this.setState({ isVisibleCvc: false, isVisibleName: false, isVisibleNumber: false, isCompletePay: false, isVisibleExpiry: true });
            } else if (this.state.isVisibleName) {
                this.setState({ isVisibleNumber: false, isVisibleExpiry: false, isVisibleName: false, isCompletePay: false, isVisibleCvc: true });
            } else if (this.state.isCompletePay) {
                this.setState({ isVisibleNumber: false, isVisibleExpiry: false, isVisibleCvc: false, isCompletePay: false, isVisibleName: true });
            }
        }
    }

    onEventRight = () => {
        if (this.state.dataCredicars != null) {
            let card = this.state.dataCredicars;
            if (this.state.isVisibleNumber && card.status.number == "valid") {
                this.setState({ isVisibleNumber: false, isVisibleCvc: false, isVisibleName: false, isCompletePay: false, isVisibleExpiry: true });
            } else if (this.state.isVisibleExpiry && card.status.expiry == "valid") {
                this.setState({ isVisibleNumber: false, isVisibleExpiry: false, isVisibleName: false, isCompletePay: false, isVisibleCvc: true });
            } else if (this.state.isVisibleCvc && card.status.cvc == "valid") {
                this.setState({ isVisibleNumber: false, isVisibleExpiry: false, isVisibleCvc: false, isCompletePay: false, isVisibleName: true });
            } else if (this.state.isVisibleName && card.status.name == "valid") {
                if (this.props.route.params.tipo == 1) {
                    const { total, cuotasInicio, cuotasFin } = this.onEventGeneratePay(1);
                    this.setState({
                        isVisibleNumber: false,
                        isVisibleExpiry: false,
                        isVisibleCvc: false,
                        isVisibleName: false,
                        isCompletePay: true,
                        montoTotal: total,
                        cuotasInicio: cuotasInicio,
                        cuotasFin: cuotasFin
                    });
                } else {
                    const { total } = this.onEventGeneratePay(2);
                    this.setState({
                        isVisibleNumber: false,
                        isVisibleExpiry: false,
                        isVisibleCvc: false,
                        isVisibleName: false,
                        isCompletePay: true,
                        montoTotal: total,
                    });
                }
            } else {
                if (this.state.isVisibleNumber) {
                    Alert.alert("Información", "El número de tarjeta no es correcto.");
                } else if (this.state.isVisibleExpiry) {
                    Alert.alert("Información", "La fecha de experación no es correcta.");
                } else if (this.state.isVisibleCvc) {
                    Alert.alert("Información", "El CVC/CCV no es correcto.");
                } else {
                    Alert.alert("Información", "Ingrese el titular de la tarjeta.");
                }
            }
        } else {
            Alert.alert("Información", "Ingrese el número de tarjeta.");
        }
    }

    async onValidateCard() {
        if (this.state.dataCredicars != null) {
            let card = this.state.dataCredicars;
            if (card.valid) {
                if (!validateEmail(this.state.email)) {
                    Alert.alert("Información", "Ingrese su Correo Electrónico.");
                    this.txtEmail.current.focus();
                } else {
                    let array = card.values.expiry.trim().split("/");
                    if (this.state.guardarTarjeta) {
                        await this.props.addCrediCard({
                            "card_number": card.values.number.replace(/ /g, ""),
                            "cvv": card.values.cvc.trim(),
                            "expiration": card.values.expiry.trim(),
                            "name": card.values.name.trim(),
                            "email": this.state.email.trim(),
                        });
                    }
                    if (this.props.route.params.tipo == 1) {
                        this.props.navigation.navigate('DocumentoPago',
                            {
                                "tipo": this.props.route.params.tipo,
                                "card_number": card.values.number.replace(/ /g, ""),
                                "cvv": card.values.cvc.trim(),
                                "expiration_month": array[0],
                                "expiration_year": array[1],
                                "email": this.state.email.trim(),
                                "monto": formatMoney(this.state.montoTotal),
                                "cuotas": this.props.route.params.cuotas,
                                "cuotasInicio": this.state.cuotasInicio,
                                "cuotasFin": this.state.cuotasFin
                            });
                    } else {
                        this.props.navigation.navigate('DocumentoPago',
                            {
                                "tipo": this.props.route.params.tipo,
                                "card_number": card.values.number.replace(/ /g, ""),
                                "cvv": card.values.cvc.trim(),
                                "expiration_month": array[0],
                                "expiration_year": array[1],
                                "email": this.state.email.trim(),
                                "monto": formatMoney(this.state.montoTotal),
                                "cuotas": this.props.route.params.cuotas,
                                "objectCertificadoHabilidad": this.props.route.params.objectCertificadoHabilidad
                            });
                    }
                }
            }
        }
    }



    onEventGeneratePay(tipo) {
        let data = this.props.route.params.cuotas;
        let monto = 0;
        for (item of data) {
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
        let dolar = this.props.route.params.dolar;

        let monto_depositar = montoTotal - ((((montoTotal * (comision_varible / 100)) + (comision_fija * dolar)) * (igvp / 100)) + ((montoTotal * (comision_varible / 100)) + (comision_fija * dolar)));
        let monto_cobrar = montoTotal + ((montoTotal - monto_depositar) + montoAum);

        let total = Math.round(monto_cobrar);

        let cuotasInicio = tipo == 1 ? data[0].year + "-" + data[0].mes + "-" + data[0].day : "";
        let cuotasFin = tipo == 1 ? data[data.length - 1].year + "-" + data[data.length - 1].mes + "-" + data[data.length - 1].day : "";
        return { total, cuotasInicio, cuotasFin }
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
                            Realizar Pago
                        </Text>
                    </View>
                    <View>
                        <Text style={{ ...FONTS.h3 }}>S/ {this.props.route.params.monto}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, paddingVertical: 10, }}>
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        <CreditCardInput
                            iconLeftButton={icons.back}
                            iconRightButton={icons.chevron}
                            onEventLeft={this.onEventLeft}
                            onEventRight={this.onEventRight}
                            guardarTarjeta={this.state.guardarTarjeta}
                            onGuardarTarjeta={(value) => this.setState({ guardarTarjeta: value })}
                            isVisibleNumber={this.state.isVisibleNumber}
                            isVisibleExpiry={this.state.isVisibleExpiry}
                            isVisibleCvc={this.state.isVisibleCvc}
                            isVisibleName={this.state.isVisibleName}
                            isCompletePay={this.state.isCompletePay}
                            labels={{ number: "NÚMERO DE TARJETA", expiry: "EXPIRA", cvc: "CVC/CCV", name: "INGRESE SUS DATOS" }}
                            placeholders={{ number: "1234 5678 1234 5678", expiry: "MM/YY", cvc: "CVC", name: "NOMBRE" }}
                            requiresName={true}
                            labelStyle={{ ...FONTS.h4, color: COLORS.secondary }}
                            inputStyle={{
                                ...FONTS.h3,
                            }}
                            inputContainerStyle={{
                                borderBottomWidth: 2,
                                borderBottomColor: '#C1BFBF'
                            }}
                            onChange={(data) => { this.setState({ dataCredicars: data }) }}
                        />

                        {
                            this.state.isCompletePay ?
                                <>
                                    <View style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ ...FONTS.h4, color: "#474747", textAlign: 'center' }}>Se le va a cobrar un monto adicional por transacción de plataforma.</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            width: 220,
                                        }}>
                                            <TextInput
                                                ref={this.txtEmail}
                                                style={{
                                                    ...FONTS.h3,
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    height: 40,
                                                    borderBottomWidth: 2,
                                                    borderBottomColor: '#C1BFBF',
                                                    paddingLeft: 10,
                                                }}
                                                placeholder="Correo Electrónico"
                                                onChangeText={(text) => { this.setState({ email: text }) }}
                                                value={this.state.email}
                                                onSubmitEditing={() => this.onValidateCard()}
                                            />
                                        </View>
                                    </View>

                                </>
                                : null
                        }
                    </ScrollView>
                </View>
                {
                    this.state.isCompletePay ?
                        <View style={{ backgroundColor: COLORS.primary }}>
                            <TouchableOpacity style={{ padding: 20, }} onPress={() => this.onValidateCard()}>
                                <Text style={{ ...FONTS.h3, color: COLORS.white, textAlign: 'center' }}>PAGAR S/ {formatMoney(this.state.montoTotal)}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
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

const mapDispatchToProps = (dispatch) => {
    return {
        addCrediCard: (card) => dispatch(addCard(card))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrediCars);


