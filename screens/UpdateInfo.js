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
    TextInput,
    Button
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { COLORS, SIZES, icons, FONTS, URL, images } from '../constants';
import { fetch_timeout, formatMoney } from "./tools/Tools";
import { connect } from 'react-redux';

class UpdateInfo extends React.Component {

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

            nombres: '',
            apellidos: '',
            dni: '',
            celular: '',
            direccion: '',
            correo: '',
            sexo: '',
            dataSexo: [
                { "id": "M", "nombreSexo": "Masculino" },
                { "id": "F", "nombreSexo": "Femenino" }
            ],
            fechaNacimiento: "2022-07-11",

            datePicker: false
        }

        this.props.navigation.setOptions({
            title: 'Datos Personales',
            headerTitle: 'Datos Personales',
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
        // this.loadCertHabilidad();
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

    onEventConfirmarEdicion() {
        return;
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

    showDatePicker = () => {
        this.setState({datePicker: true});
    };
    

    onDateSelected = (event) => {
        this.setState({datePicker: false, fechaNacimiento: event.target.value});
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Image source={icons.pay} resizeMode='contain' style={{ width: 24, height: 24, tintColor: COLORS.black }} /> */}
                        <Icon name="user-edit" size={24} color="#000000" />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Editar Información
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
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Nombres</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.nombresRef = input; }}
                                            placeholder="Nombres"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ nombres: text }) }}
                                            value={this.state.nombres}
                                            onSubmitEditing={() => { this.onEventConfirmarEdicion() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Apellidos</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.apellidosRef = input; }}
                                            placeholder="Apellidos"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ apellidos: text }) }}
                                            value={this.state.apellidos}
                                            onSubmitEditing={() => { this.onEventConfirmarEdicion() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>DNI</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.dniRef = input; }}
                                            placeholder="DNI"
                                            placeholderTextColor={COLORS.grayLight}
                                            keyboardType="numeric"
                                            onChangeText={(text) => { this.setState({ dni: text }) }}
                                            value={this.state.dni}
                                            onSubmitEditing={() => { this.onEventConfirmarEdicion() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Celular</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.celularRef = input; }}
                                            placeholder="Celular"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ celular: text }) }}
                                            value={this.state.celular}
                                            onSubmitEditing={() => { this.onEventConfirmarEdicion() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Dirección</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.direccionRef = input; }}
                                            placeholder="Dirección"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ direccion: text }) }}
                                            value={this.state.direccion}
                                            onSubmitEditing={() => { this.onEventConfirmarEdicion() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Correo Electrónico</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={styles.input}
                                            ref={(input) => { this.correoRef = input; }}
                                            placeholder="Correo Electrónico"
                                            placeholderTextColor={COLORS.grayLight}
                                            onChangeText={(text) => { this.setState({ correo: text }) }}
                                            value={this.state.correo}
                                            onSubmitEditing={() => { this.onEventConfirmarEdicion() }}
                                        />
                                    </View>
                                </View>

                                <View style={{ padding: 10, }}>
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Sexo</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.input}>
                                            <SelectDropdown
                                                data={this.state.dataSexo}
                                                defaultButtonText={"- Seleccione -"}
                                                onSelect={(selectedItem, index) => {
                                                    this.setState({ sexo: selectedItem.id });
                                                }}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    return selectedItem.nombreSexo
                                                }}
                                                rowTextForSelection={(item, index) => {
                                                    return item.nombreSexo
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
                                    <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Fecha de Nacimiento</Text>
                                    <View style={{ flexDirection: 'row' }}>

                                        { this.state.datePicker && (
                                            <DateTimePicker
                                                mode={'date'}
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                is24Hour={true}
                                                value={this.state.fechaNacimiento}
                                                onChange={(event) => this.onDateSelected(event)}
                                                style={styles.datePicker}
                                            />
                                        )}

                                        { !this.state.datePicker && (
                                            <View style={{ margin: 10 }}>
                                                <Button title="Cambiar" color="green" onPress={() => this.showDatePicker()} />
                                            </View>
                                        )}

                                        <Text style={styles.text}>{this.state.fechaNacimiento}</Text>

                                    </View>
                                </View>

                                {/* --- */}

                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.green, }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.onEventConfirmarEdicion()}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="save" size={24} color="#FFFFFF" />
                                <Text style={{ ...FONTS.h1, color: COLORS.white, textAlign: 'center', marginLeft: 10 }}>Guardar</Text>
                            </View>
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
    text: {
        fontSize: 25,
        color: 'black',
        padding: 3,
        marginBottom: 10,
        textAlign: 'center'
      },
    // Style for iOS ONLY...
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 320,
        height: 260,
        display: 'flex',
    },
});


const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}


export default connect(mapStateToProps)(UpdateInfo);