import React from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    TextInput
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { COLORS, icons, FONTS, URL } from '../../constants';
import { fetch_timeout, formatMoney } from "../tools/Tools";
import { connect } from 'react-redux';

class PagoCertHabilidad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadData: false,
            idEspecialidad: '',
            especialidades: [],
            cuotas: [],
            asunto: 'EJERCICIO DE LA PROFESIÓN',
            entidad: 'VARIOS',
            lugar: 'A NIVEL NACIONAL',
            totalCertificado: 0,
            token: JSON.parse(this.props.token.userToken),
        }

        this.props.navigation.setOptions({
            title: 'Certificado Habilidad',
            headerTitle: 'Certificado Habilidad',
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
        this.loadCertHabilidad();
    }

    async loadCertHabilidad() {
        this.setState({ especialidades: [], loadData: true });
        let result = await fetch_timeout(URL.PAGOS_CERTHABILIDAD, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "idDNI": this.state.token.idDNI,
            })
        });

        if (result.state === 1) {
            let array = [{
                "concepto": [
                    {
                        "IdConcepto": result.data.idConcepto,
                        "Categoria": result.data.Categoria,
                        "Cantidad": 1,
                        "Concepto": result.data.Concepto,
                        "Precio": result.data.Precio
                    }
                ]
            }];

            this.setState({
                especialidades: result.especialidades,
                cuotas: array,
                totalCertificado: result.data.Precio,
                loadData: false
            });
        } else {
            this.setState({ loadData: false });
        }
    }

    onEventConfirmarPago() {
        if (this.state.idEspecialidad.length == 0) {
            Alert.alert("Alerta", "Seleccione su Especialidad.");
        } else if (this.state.asunto.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese el asunto.");
            this.asuntoRef.focus();
        } else if (this.state.entidad.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese la entidad.");
            this.entidadRef.focus();
        } else if (this.state.lugar.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese el lugar.");
            this.lugarRef.focus();
        } else {
            this.props.navigation.navigate('CargarTarjeta', {
                "tipo": 2,
                "monto": formatMoney(this.state.totalCertificado),
                "cuotas": this.state.cuotas,
                "objectCertificadoHabilidad": {
                    "idEspecialidad": this.state.idEspecialidad,
                    "asunto": this.state.asunto.trim(),
                    "entidad": this.state.entidad.trim(),
                    "lugar": this.state.lugar.trim(),
                    "anulado": 0
                }
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={icons.pay} resizeMode='contain' style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Pagar Certificado de Habilidad
                        </Text>
                    </View>
                </View>

                {
                    this.state.loadData ?
                        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
                            <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                    <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>Cargando información...</Text>
                                </View>
                            </View>
                        </View>
                        : null
                }

                <View style={styles.container}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10, }}>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Especialidad(es)</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.input}>
                                            <SelectDropdown
                                                data={this.state.especialidades}
                                                defaultButtonText={"- Seleccione -"}
                                                onSelect={(selectedItem, index) => {
                                                    this.setState({ idEspecialidad: selectedItem.idColegiado });
                                                }}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    return selectedItem.Especialidad
                                                }}
                                                rowTextForSelection={(item, index) => {
                                                    return item.Especialidad
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
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Asunto</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.asuntoRef = input; }}
                                            placeholder="Asunto"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ asunto: text }) }}
                                            value={this.state.asunto}
                                            onSubmitEditing={() => { this.onEventConfirmarPago() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Entidad o Propietario</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.entidadRef = input; }}
                                            placeholder="Entidad o Propietario"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ entidad: text }) }}
                                            value={this.state.entidad}
                                            onSubmitEditing={() => { this.onEventConfirmarPago() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Lugar</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.lugarRef = input; }}
                                            placeholder="Lugar"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ lugar: text }) }}
                                            value={this.state.lugar}
                                            onSubmitEditing={() => { this.onEventConfirmarPago() }}
                                        />
                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.green, }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.onEventConfirmarPago()}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={icons.pay}
                                    resizeMode='contain'
                                    style={{ width: 24, height: 24, tintColor: COLORS.white }} />
                                <Text style={{ ...FONTS.h3, color: COLORS.white, textAlign: 'center', marginLeft: 10 }}>PAGAR</Text>
                            </View>
                            <Text style={styles.textMessageData}>TOTAL S/ {formatMoney(this.state.totalCertificado)}</Text>
                        </TouchableOpacity>
                    </View>
                </View >

            </SafeAreaView >
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contenedorTitulo: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#C1BFBF',
    },
    textMessageData: {
        ...FONTS.h4, color: COLORS.white, textAlign: 'center'
    },
});


const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}


export default connect(mapStateToProps)(PagoCertHabilidad);