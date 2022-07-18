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
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-date-picker';
import { COLORS, SIZES, icons, FONTS, URL } from '../../constants';
import { getDateForma, getCurrentDate } from "../tools/Tools";
import { connect } from 'react-redux';

class PerfilActualizar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reload: false,
            message: '',
            token: JSON.parse(this.props.token.userToken),

            process: false,

            nombres: '',
            apellidos: '',
            dni: '',
            celular: '',
            direccion: '',
            correo: '',
            sexo: '',
            indexSexo: -1,
            dataSexo: [
                { "id": "M", "nombreSexo": "Masculino" },
                { "id": "F", "nombreSexo": "Femenino" }
            ],
            fechaNacimiento: new Date(Date.now()),
            fechaNacimientoText: getDateForma(getCurrentDate()),

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

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }


    componentDidMount() {
        this.loadInformacion();
    }

    async loadInformacion() {
        try {
            await this.setStateAsync({ isLoading: true, reload: false, message: 'Cargando información...', });

            let result = await axios.post(URL.OBTENER_PERSONA, {
                "idDni": this.state.token.idDNI,
            }, {
                timeout: 20000
            });

            const [year, month, day] = result.data.user.FechaNacimiento.split('-');

            let indexSex = -1;
            this.state.dataSexo.map((item, index) => {
                if (item.id == result.data.user.Sexo) {
                    indexSex = index;
                }
            });

            await this.setStateAsync({
                isLoading: false,
                nombres: result.data.user.Nombres,
                apellidos: result.data.user.Apellidos,
                dni: result.data.user.NumDoc,
                celular: result.data.phone,
                direccion: result.data.ubicacion,
                correo: result.data.email,
                sexo: result.data.user.Sexo,
                indexSexo: indexSex,
                fechaNacimiento: new Date(year, month - 1, day, 0, 0, 0, 0),
                fechaNacimientoText: getDateForma(result.data.user.FechaNacimiento)
            });

        } catch (error) {
            if (error.response) {
                await this.setStateAsync({
                    isLoading: true,
                    reload: true,
                    message: error.response.data
                });
            } else {
                await this.setStateAsync({
                    isLoading: true,
                    reload: true,
                    message: "Tiempo de espera agotado, intente nuevamente en un par de minutos."
                });
            }
        }
    }

    async onEventGuardar() {
        if (this.state.nombres.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese su nombre.");
            this.nombresRef.focus();
            return;
        }

        if (this.state.apellidos.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese sus apellidos.");
            this.apellidosRef.focus();
            return;
        }

        if (this.state.dni.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese su n° de dni.");
            this.dniRef.focus();
            return;
        }

        if (this.state.celular.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese el n° de celular.");
            this.celularRef.focus();
            return;
        }

        if (this.state.direccion.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese su dirección.");
            this.direccionRef.focus();
            return;
        }

        if (this.state.correo.trim().length == 0) {
            Alert.alert("Alerta", "Ingrese su correo electrónico.");
            this.correoRef.focus();
            return;
        }

        if (this.state.sexo == "") {
            Alert.alert("Alerta", "Seleccione su sexo.");
            return;
        }

        try {
            await this.setStateAsync({ process: true });
            let result = await axios.post(URL.ACTUALIZAR_PERSONA, {
                "idDni": this.state.token.idDNI,
                "phone": this.state.celular.trim(),
                "address": this.state.direccion.trim(),
                "email": this.state.correo.trim(),
                "Nombres": this.state.nombres.trim(),
                "Apellidos": this.state.apellidos.trim(),
                "NumDoc": this.state.dni.trim(),
                "Sexo": this.state.sexo,
                "FechaNacimiento": this.state.fechaNacimiento.getFullYear() + "-" + (this.state.fechaNacimiento.getMonth() + 1) + "-" + this.state.fechaNacimiento.getDate(),
            });
            await this.setStateAsync({ process: false });
            Alert.alert("Alerta", result.data);
        } catch (error) {
            console.log(error)
            await this.setStateAsync({ process: false });
            if (error.response) {
                Alert.alert("Alerta", error.response.data);
            } else {
                Alert.alert("Alerta", "Se produjo un error, intente nuevamente en un par de minutos.");
            }
        }
    }

    showDatePicker = async () => {
        await this.setStateAsync({ datePicker: true });
    };

    hideDatePicker = async () => {
        await this.setStateAsync({ datePicker: false });
    };

    onDateSelected = async (event) => {
        await this.setStateAsync({ datePicker: false });
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
                    this.state.isLoading ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding }}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center', marginBottom: 10 }}>{this.state.message}</Text>
                            {
                                this.state.reload ?
                                    (
                                        <TouchableOpacity onPress={() => this.loadInformacion()} style={{ flexDirection: 'row' }}>
                                            <Image
                                                source={icons.reload}
                                                resizeMode='contain'
                                                style={{ width: 20, height: 20, tintColor: COLORS.blue, marginRight: 5 }} />
                                            <Text style={{ ...FONTS.h4, textDecorationLine: 'underline' }}>Actualizar Vista</Text>
                                        </TouchableOpacity>
                                    ) : null
                            }
                        </View>
                        :
                        <>
                            {this.state.process ?
                                <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
                                    <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                                        <View style={{ padding: 10, alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color={COLORS.primary} />
                                            <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>Procesando Petición...</Text>
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
                                                        keyboardType="phone-pad"
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
                                                        keyboardType="email-address"
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
                                                            defaultValueByIndex={this.state.indexSexo}
                                                            onSelect={async (selectedItem, index) => {
                                                                await this.setStateAsync({ sexo: selectedItem.id });
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
                                                                borderColor: "trasparant"
                                                            }}
                                                            buttonTextStyle={{
                                                                color: COLORS.secondary,
                                                                textAlign: "left",
                                                                ...FONTS.body4,
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ padding: 10 }}>
                                                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Fecha de Nacimiento</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={styles.input}>
                                                        <DatePicker
                                                            modal
                                                            title={"Fecha de Nacimiento"}
                                                            cancelText={"Cerrar"}
                                                            confirmText={"Aceptar"}
                                                            mode='date'
                                                            open={this.state.datePicker}
                                                            date={this.state.fechaNacimiento}
                                                            locale={"es"}
                                                            onConfirm={(date) => {
                                                                this.hideDatePicker();
                                                                let current = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

                                                                this.setState({
                                                                    fechaNacimiento: current,
                                                                    fechaNacimientoText: getDateForma(current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDate())
                                                                });
                                                            }}
                                                            onCancel={() => {
                                                                this.hideDatePicker();
                                                            }}
                                                        />

                                                        <TouchableOpacity style={{ width: '100%' }}
                                                            onPress={() => this.showDatePicker()}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Icon
                                                                    name="calendar"
                                                                    color={COLORS.secondary}
                                                                    size={20}
                                                                />
                                                                <Text style={{ marginLeft: 10, ...FONTS.body4, color: COLORS.black }}>{this.state.fechaNacimientoText}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>

                                <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.green, }}>
                                    <TouchableOpacity
                                        style={{ justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => this.onEventGuardar()}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name="save" size={22} color="#FFFFFF" />
                                            <Text style={{
                                                ...FONTS.body2,
                                                color: COLORS.white,
                                                textAlign: 'center',
                                                marginLeft: 10
                                            }}>Guardar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View >
                        </>
                }

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
        paddingLeft: 0,
        borderBottomWidth: 2,
        borderBottomColor: '#C1BFBF',
    },
    textMessageData: {
        ...FONTS.h4,
        color: COLORS.white,
        textAlign: 'center'
    },
    text: {
        fontSize: 25,
        color: 'black',
        padding: 3,
        marginBottom: 10,
        textAlign: 'center'
    }
});


const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}

export default connect(mapStateToProps)(PerfilActualizar);