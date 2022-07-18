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
    Keyboard,
    Alert,
    TextInput
} from 'react-native';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, icons, FONTS, URL, SIZES } from '../../constants';
import { formaText, lowerCase } from "../tools/Tools";
import { connect } from 'react-redux';

class BusquedaColegiado extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: '',
            loadData: false,
            reload: false,
            idBuscar: -1,
            dataBuscar: [
                { "Id": 0, "Nombre": "Número de Documento" },
                { "Id": 1, "Nombre": "Apellidos y Nombres" }
            ],
            documento: '',
            informacion: '',
            token: JSON.parse(this.props.token.userToken),

            CIP: '',
            NumDoc: '',
            Apellidos: '',
            Nombres: '',
            Condicion: '',
            FechaColegiado: '',
            Habilidad: '',
            Image: null,
            Colegiaturas: [],
            Correos: [],
            Telefonos: []
        }

        this.props.navigation.setOptions({
            title: 'Busqueda de Colegiado',
            headerTitle: 'Busqueda de Colegiado',
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

        this.refDocumento = React.createRef();
        this.refInformacion = React.createRef();
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    async onEventBuscarPersona() {
        if (this.state.loading) {
            return;
        }

        if (this.state.idBuscar == -1) {
            Alert.alert("Consultar", "Seleccione el metodo a buscar.");
            return;
        }

        if (this.state.idBuscar == 0 && this.state.documento == "") {
            this.refDocumento.current.focus();
            return;
        }

        if (this.state.idBuscar == 1 && this.state.informacion == "") {
            this.refInformacion.current.focus();
            return;
        }

        try {
            Keyboard.dismiss();
            await this.setStateAsync({
                loading: true,
                message: "Cargando información..."
            });
            let result = await axios.post(URL.VALIDAR_HABILIDAD_PERSONA, {
                search: this.state.idBuscar == 0 ? this.state.documento : this.state.informacion
            }, {
                timeout: 50000
            });
            console.log(result.data)
            let persona = result.data.persona;

            await this.setStateAsync({
                CIP: persona.CIP,
                NumDoc: persona.NumDoc,
                Apellidos: persona.Apellidos,
                Nombres: persona.Nombres,
                Condicion: persona.Condicion,
                FechaColegiado: persona.FechaColegiado,
                Habilidad: persona.Habilidad,
                Image: result.data.image,
                Colegiaturas: result.data.colegiaturas,
                Correos: result.data.correos,
                Telefonos: result.data.telefonos,

                idBuscar: -1,
                loading: false
            });
        } catch (error) {
            if (error.response) {
                await this.setStateAsync({
                    reload: true,
                    message: error.response.data
                });
            } else {
                await this.setStateAsync({
                    reload: true,
                    message: "Tiempo de espera agotado, intente nuevamente en un par de minutos."
                });
            }
        }
    }

    async onEventReload(){
        await this.setStateAsync({
            CIP: '',
            NumDoc: '',
            Apellidos: '',
            Nombres: '',
            Condicion: '',
            FechaColegiado:'',
            Habilidad: '',
            Image: null,
            Colegiaturas: [],
            Correos: [],
            Telefonos: [],

            idBuscar: -1,
            loading: false
        });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={icons.pay} resizeMode='contain' style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Consultar
                        </Text>
                    </View>
                </View>

                {
                    this.state.loading ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding }}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={{
                                ...FONTS.h3,
                                color: COLORS.black,
                                textAlign: 'center',
                                marginBottom: 10
                            }}>{this.state.message}</Text>
                            {
                                this.state.reload ?
                                    (
                                        <TouchableOpacity onPress={() => this.onEventReload()} style={{ flexDirection: 'row' }}>
                                            <Image
                                                source={icons.reload}
                                                resizeMode='contain'
                                                style={{ width: 20, height: 20, tintColor: COLORS.blue, marginRight: 5 }} />
                                            <Text style={{ ...FONTS.h4, textDecorationLine: 'underline' }}>Buscar nuevamente</Text>
                                        </TouchableOpacity>
                                    ) : null
                            }
                        </View>
                        :
                        <View style={styles.container}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <ScrollView style={{ flex: 1 }}>
                                    <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10, }}>

                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Buscar Por</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <SelectDropdown
                                                    data={this.state.dataBuscar}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    defaultButtonText={"- Seleccione -"}
                                                    onSelect={async (selectedItem, index) => {
                                                        await this.setStateAsync({
                                                            idBuscar: selectedItem.Id
                                                        });
                                                    }}

                                                    buttonTextAfterSelection={(selectedItem, index) => {
                                                        return selectedItem.Nombre
                                                    }}

                                                    rowTextForSelection={(item, index) => {
                                                        return item.Nombre
                                                    }}

                                                    buttonStyle={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        height: 40,
                                                        borderBottomWidth: 2,
                                                        borderBottomColor: '#C1BFBF',
                                                    }}
                                                    buttonTextStyle={{
                                                        ...FONTS.body4,
                                                        color: '#444',
                                                        textAlign: 'left'
                                                    }}

                                                    renderDropdownIcon={isOpened => {
                                                        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={COLORS.grayLight} size={18} />;
                                                    }}
                                                    dropdownIconPosition={'left'}

                                                    rowStyle={{
                                                        backgroundColor: '#EFEFEF',
                                                        borderBottomColor: '#C5C5C5'
                                                    }}
                                                    rowTextStyle={{
                                                        ...FONTS.body3,
                                                        color: COLORS.black,
                                                        textAlign: 'left'
                                                    }}

                                                />
                                            </View>
                                        </View>

                                        {
                                            this.state.idBuscar == 0 ?
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.secondary
                                                    }}>N° Dni o Cip</Text>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        height: 40,
                                                        borderBottomWidth: 2,
                                                        borderBottomColor: '#C1BFBF',
                                                    }}>
                                                        <FontAwesome
                                                            name={'hashtag'}
                                                            color={COLORS.grayLight}
                                                            size={18}
                                                        />
                                                        <TextInput
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                ...FONTS.body4,
                                                                color: COLORS.black,
                                                                paddingHorizontal: 10
                                                            }}
                                                            ref={this.refDocumento}
                                                            placeholder="Ingrese el dato requerido."
                                                            placeholderTextColor={COLORS.grayLight}
                                                            keyboardType={"numeric"}
                                                            onChangeText={(text) => { this.setState({ documento: text }) }}
                                                            value={this.state.documento}
                                                            onSubmitEditing={() => { this.onEventBuscarPersona() }}
                                                        />
                                                    </View>
                                                </View> :
                                                null
                                        }

                                        {
                                            this.state.idBuscar == 1 ?
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={{
                                                        ...FONTS.h4,
                                                        color: COLORS.secondary
                                                    }}>Apellidos y Nombre(s)</Text>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        height: 40,
                                                        borderBottomWidth: 2,
                                                        borderBottomColor: '#C1BFBF',
                                                    }}>
                                                        <FontAwesome
                                                            name={'address-card'}
                                                            color={COLORS.grayLight}
                                                            size={18}
                                                        />
                                                        <TextInput
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                ...FONTS.body4,
                                                                color: COLORS.black,
                                                                paddingHorizontal: 10
                                                            }}
                                                            ref={this.refInformacion}
                                                            placeholder="Ingrese la información requerida."
                                                            placeholderTextColor={COLORS.grayLight}
                                                            onChangeText={(text) => { this.setState({ informacion: text }) }}
                                                            value={this.state.informacion}
                                                            onSubmitEditing={() => { this.onEventBuscarPersona() }}
                                                        />
                                                    </View>
                                                </View>
                                                :
                                                null
                                        }


                                        <View style={{ padding: 10, }}>
                                            <Text style={{
                                                textAlign: 'center',
                                                ...FONTS.h3,
                                                color: COLORS.grayDark
                                            }}>Resultados de la Busqueda</Text>
                                        </View>

                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            marginVertical: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                width: '30%',
                                                ...FONTS.h4,
                                            }}>
                                                Número de CIP :
                                            </Text>
                                            <Text
                                                selectable={true}
                                                style={{
                                                    width: '70%',
                                                    ...FONTS.h4,
                                                    color: COLORS.black,
                                                    paddingHorizontal: 5
                                                }}>{this.state.CIP}</Text>
                                        </View>

                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            marginVertical: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                width: '30%',
                                                ...FONTS.h4,
                                            }}>
                                                Apellidos :
                                            </Text>
                                            <Text
                                                selectable={true}
                                                style={{
                                                    width: '70%',
                                                    ...FONTS.h4,
                                                    color: COLORS.black,
                                                    paddingHorizontal: 5
                                                }}>{this.state.Apellidos}</Text>
                                        </View>

                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            marginVertical: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                width: '30%',
                                                ...FONTS.h4,
                                            }}>
                                                Nombres :
                                            </Text>
                                            <Text
                                                selectable={true}
                                                style={{
                                                    width: '70%',
                                                    ...FONTS.h4,
                                                    color: COLORS.black,
                                                    paddingHorizontal: 5
                                                }}>{this.state.Nombres}</Text>
                                        </View>

                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            marginVertical: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                width: '30%',
                                                ...FONTS.h4,
                                            }}>
                                                Tipo:
                                            </Text>
                                            <Text
                                                selectable={true}
                                                style={{
                                                    width: '70%',
                                                    ...FONTS.h4,
                                                    color: COLORS.black,
                                                    paddingHorizontal: 5
                                                }}>{this.state.Condicion}</Text>
                                        </View>

                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            marginVertical: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                width: '30%',
                                                ...FONTS.h4,
                                            }}>
                                                Fecha Incorporación :
                                            </Text>
                                            <Text
                                                selectable={true}
                                                style={{
                                                    width: '70%',
                                                    ...FONTS.h4,
                                                    color: COLORS.black,
                                                    paddingHorizontal: 5
                                                }}>{this.state.FechaColegiado}</Text>
                                        </View>

                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            marginVertical: 5,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                width: '30%',
                                                ...FONTS.h4,
                                            }}>
                                                Condición :
                                            </Text>
                                            <Text
                                                selectable={true}
                                                style={{
                                                    width: '70%',
                                                    ...FONTS.h4,
                                                    color: this.state.Habilidad == "Habilitado" ? COLORS.green : COLORS.primary,
                                                    paddingHorizontal: 5
                                                }}>{this.state.Habilidad}</Text>
                                        </View>

                                        <View
                                            style={{
                                                marginVertical: 10,
                                                borderColor: COLORS.grayLight,
                                                borderBottomWidth: 1,
                                                borderTopWidth: 1,
                                            }}>
                                            {
                                                this.state.Colegiaturas.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <View style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            marginVertical: 5,
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                width: '30%',
                                                                ...FONTS.h4,
                                                            }}>
                                                                Capitulo :
                                                            </Text>
                                                            <Text
                                                                selectable={true}
                                                                style={{
                                                                    width: '70%',
                                                                    ...FONTS.h4,
                                                                    color: COLORS.black,
                                                                    marginHorizontal: 5
                                                                }}>{item.Capitulo}</Text>
                                                        </View>

                                                        <View style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            marginVertical: 5,
                                                        }}>
                                                            <Text style={{
                                                                width: '30%',
                                                                ...FONTS.h4,
                                                            }}>
                                                                Especialidad:
                                                            </Text>
                                                            <Text
                                                                selectable={true}
                                                                style={{
                                                                    width: '70%',
                                                                    ...FONTS.h4,
                                                                    color: COLORS.black,
                                                                    paddingHorizontal: 5
                                                                }}>{item.Especialidad}</Text>
                                                        </View>
                                                    </React.Fragment>
                                                ))
                                            }

                                        </View>

                                        <View
                                            style={{
                                                marginVertical: 10,
                                                borderColor: COLORS.grayLight,
                                                borderBottomWidth: 1,
                                                borderTopWidth: 1,
                                            }}>
                                            {
                                                this.state.Correos.map((item, index) => (
                                                    <View key={index} style={{
                                                        width: '100%',
                                                        flexDirection: 'row',
                                                        marginVertical: 5,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text style={{
                                                            width: '30%',
                                                            ...FONTS.h4,
                                                        }}>
                                                            {formaText(item.Tipo)} :
                                                        </Text>
                                                        <Text
                                                            selectable={true}
                                                            style={{
                                                                width: '70%',
                                                                ...FONTS.h4,
                                                                color: COLORS.black,
                                                                marginHorizontal: 5
                                                            }}>{lowerCase(item.Direccion)}</Text>
                                                    </View>
                                                ))
                                            }

                                            {
                                                this.state.Telefonos.map((item, index) => (
                                                    <View key={index} style={{
                                                        width: '100%',
                                                        flexDirection: 'row',
                                                        marginVertical: 5,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text style={{
                                                            width: '30%',
                                                            ...FONTS.h4,
                                                        }}>
                                                            {formaText(item.Tipo)} :
                                                        </Text>
                                                        <Text
                                                            selectable={true}
                                                            style={{
                                                                width: '70%',
                                                                ...FONTS.h4,
                                                                color: COLORS.black,
                                                                marginHorizontal: 5
                                                            }}>{item.Telefono}</Text>
                                                    </View>
                                                ))
                                            }
                                        </View>

                                    </View>
                                </ScrollView>
                            </View>

                            <View style={{ paddingHorizontal: 20, paddingVertical: 15, backgroundColor: COLORS.green, }}>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.onEventBuscarPersona()}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={icons.search}
                                            resizeMode='contain'
                                            style={{ width: 24, height: 24, tintColor: COLORS.white }} />
                                        <Text style={{ ...FONTS.h3, color: COLORS.white, textAlign: 'center', marginLeft: 10 }}>CONSULTAR</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View >
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
        borderBottomWidth: 2,
        borderBottomColor: '#C1BFBF',
    },
});

const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}


export default connect(mapStateToProps)(BusquedaColegiado);