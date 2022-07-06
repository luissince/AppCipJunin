import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    Image,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { fetch_timeout } from './tools/Tools';
import { COLORS, SIZES, icons, FONTS, URL } from '../constants';
import { connect } from 'react-redux';

class DocumentoPago extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            message: "",
            stateresponse: false,
            refreshing: true,
            generate: false,
            token: JSON.parse(this.props.token.userToken),
            ubicacion: '',
            UsarRuc: false,
            idTipoDocumento: '',
            numero: '',
            cliente: '',
            direccion: '',
        }

        this.props.navigation.setOptions({
            title: 'Comprobante de Pago',
            headerTitle: 'Comprobante de Pago',
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
        this.loadComprobantes();
    }

    async loadComprobantes() {
        try {
            this.setState({ message: 'Cargando datos...', generate: true, data: [] });
            let result = await fetch_timeout(URL.LISTA_COMPROBANTES, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "idDni": this.state.token.idDNI,
                })
            });

            if (result.state === 1) {
                this.setState({ data: result.data, generate: false, ubicacion: result.ubicacion }, () => {
                    for (let value of result.data) {
                        if (value.Predeterminado == "1") {
                            this.setState({ idTipoDocumento: value.IdTipoComprobante })
                            if (value.UsarRuc == "1") {
                                this.setState({
                                    numero: '',
                                    cliente: '',
                                    direccion: '',
                                    UsarRuc: true
                                });
                            } else {
                                this.setState({
                                    numero: this.state.token.NumDoc,
                                    cliente: this.state.token.Apellidos + ' ' + this.state.token.Nombres,
                                    direccion: this.state.ubicacion,
                                    UsarRuc: false
                                });
                            }
                        }
                    }
                });
            } else {
                this.setState({ data: result.data, generate: false });
            }
        } catch (error) {
            this.setState({ generate: false });
        }
    }

    async loadSunatApi(numero) {
        if (numero.length === 11) {
            try {
                this.setState({ message: 'Obteniendo datos..', generate: true, });
                let result = await fetch_timeout("https://dniruc.apisperu.com/api/v1/ruc/" + numero + "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsZXhhbmRlcl9keF8xMEBob3RtYWlsLmNvbSJ9.6TLycBwcRyW1d-f_hhCoWK1yOWG_HJvXo8b-EoS5MhE");

                this.setState({
                    numero: result.ruc == null ? '' : result.ruc,
                    cliente: result.razonSocial == null ? '' : result.razonSocial,
                    direccion: result.direccion == null ? '' : result.direccion,
                    message: '',
                    generate: false,
                });
            } catch (error) {
                this.setState({ message: 'Obteniendo datos..', generate: false, });
            }
        }
    }

    selectedValue(itemValue) {
        for (let value of this.state.data) {
            if (value.IdTipoComprobante == itemValue.IdTipoComprobante) {
                if (value.UsarRuc == "1") {
                    this.setState({
                        numero: '',
                        cliente: '',
                        direccion: '',
                        UsarRuc: true
                    });
                } else {
                    this.setState({
                        numero: this.state.token.NumDoc,
                        cliente: this.state.token.Apellidos + ' ' + this.state.token.Nombres,
                        direccion: this.state.ubicacion,
                        UsarRuc: false
                    });
                }
                break;
            }
        }


        this.setState({ idTipoDocumento: itemValue.IdTipoComprobante });
    }

    onEventCancelarPago = () => {
        this.props.navigation.navigate('Servicios');
    }

    onEventConfirmarPago() {
        if (this.state.idTipoDocumento == '') {
            Alert.alert("Alerta", "Seleccione el Tipo Comprobante.");
        } else if (this.state.UsarRuc && this.state.numero.trim() == '') {
            Alert.alert("Alerta", "El comprobante requiere usar RUC.");
            this.numDocRef.focus();
        } else if (this.state.UsarRuc && this.state.numero.trim().length !== 11) {
            Alert.alert("Alerta", "El RUC debe tener 11 caracteres.");
            this.numDocRef.focus();
        } else if (this.state.UsarRuc && this.state.cliente.trim() == '') {
            Alert.alert("Alerta", "El comprobante requiere usar Razón Social.");
            this.clienteRef.focus();
        } else {
            if (this.props.route.params.tipo == 1) {
                this.props.navigation.navigate('ConfirmarPago',
                    {
                        "tipo": this.props.route.params.tipo,
                        "idTipoDocumento": this.state.idTipoDocumento,
                        "empresa": !this.state.UsarRuc ? null : {
                            "numero": this.state.numero.trim(),
                            "cliente": this.state.cliente.trim(),
                            "direccion": this.state.direccion.trim()
                        },
                        "card_number": this.props.route.params.card_number,
                        "cvv": this.props.route.params.cvv,
                        "expiration_month": this.props.route.params.expiration_month,
                        "expiration_year": this.props.route.params.expiration_year,
                        "email": this.props.route.params.email,
                        "monto": this.props.route.params.monto,
                        "cuotas": this.props.route.params.cuotas,
                        "cuotasInicio": this.props.route.params.cuotasInicio,
                        "cuotasFin": this.props.route.params.cuotasFin
                    });
            } else {
                this.props.navigation.navigate('ConfirmarPago',
                    {
                        "tipo": this.props.route.params.tipo,
                        "idTipoDocumento": this.state.idTipoDocumento,
                        "empresa": !this.state.UsarRuc ? null : {
                            "numero": this.state.numero.trim(),
                            "cliente": this.state.cliente.trim(),
                            "direccion": this.state.direccion.trim()
                        },
                        "card_number": this.props.route.params.card_number,
                        "cvv": this.props.route.params.cvv,
                        "expiration_month": this.props.route.params.expiration_month,
                        "expiration_year": this.props.route.params.expiration_year,
                        "email": this.props.route.params.email,
                        "monto": this.props.route.params.monto,
                        "cuotas": this.props.route.params.cuotas,
                        "objectCertificadoHabilidad": this.props.route.params.objectCertificadoHabilidad
                    });
            }
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView} >
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            source={icons.statementAccounts}
                            resizeMode='contain'
                            style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Seleccione el Comprobante de Pago
                        </Text>
                    </View>
                </View>

                {
                    this.state.generate ?
                        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
                            <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                    <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>{this.state.message}</Text>
                                </View>
                            </View>
                        </View>
                        : null
                }

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, }}>
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
                            <View style={{ padding: 10, }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Comprobante</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.input}>
                                        <SelectDropdown
                                            data={this.state.data}
                                            keyExtractor={(item, index) => index.toString()}
                                            defaultButtonText={"- Seleccione -"}
                                            onSelect={(selectedItem, index) => {
                                                this.selectedValue(selectedItem);
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                return selectedItem.Nombre
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item.Nombre
                                            }}
                                            buttonStyle={{
                                                width: "100%",
                                                height: '100%',
                                                backgroundColor: "trasparant",
                                                borderRadius: 0,
                                                borderWidth: 0,
                                                borderColor: "trasparant",
                                            }}
                                            buttonTextStyle={{ color: COLORS.secondary, textAlign: "left" }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ padding: 10, }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>D.N.I./R.U.C.</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.input}>
                                        <TouchableOpacity
                                            style={{
                                                height: '100%',
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                backgroundColor: '#C1BFBF',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            onPress={() => this.loadSunatApi(this.state.numero.trim())}>
                                            <Image
                                                source={icons.sunat_logo}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    resizeMode: 'stretch',
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <TextInput
                                            style={{
                                                width: '80%',
                                                borderWidth: 0,
                                                paddingLeft: 5
                                            }}
                                            maxLength={11}
                                            ref={(input) => { this.numDocRef = input; }}
                                            placeholder="..."
                                            keyboardType="numeric"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ numero: text }) }}
                                            value={this.state.numero}
                                            editable={this.state.UsarRuc}
                                            onSubmitEditing={() => { this.onEventConfirmarPago() }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ padding: 10, }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Nombres/Razón Social</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        style={styles.input}
                                        ref={(input) => { this.clienteRef = input; }}
                                        placeholder="..."
                                        placeholderTextColor={COLORS.grayLight}
                                        onChangeText={(text) => { this.setState({ cliente: text }) }}
                                        value={this.state.cliente}
                                        editable={this.state.UsarRuc}
                                        onSubmitEditing={() => { this.onEventConfirmarPago() }}
                                    />
                                </View>
                            </View>
                            <View style={{ padding: 10, }}>
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Dirección</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="..."
                                        placeholderTextColor={COLORS.grayLight}
                                        onChangeText={(text) => { this.setState({ direccion: text }) }}
                                        value={this.state.direccion}
                                        editable={this.state.UsarRuc}
                                        onSubmitEditing={() => { this.onEventConfirmarPago() }}
                                    />
                                </View>
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
    safeAreaView: {
        flex: 1,
        backgroundColor: COLORS.lightGray
    },
    contenedorTitulo: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    box: {
        backgroundColor: COLORS.white,
        margin: 20,
        borderRadius: SIZES.radius,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#C1BFBF',
    },
});

const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}

export default connect(mapStateToProps)(DocumentoPago);
