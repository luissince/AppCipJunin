import React from 'react';
import {
    StyleSheet,
    ScrollView,
    ImageBackground,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    Alert,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetch_timeout, validateEmail } from './tools/Tools';
import { images, COLORS, FONTS, SIZES, URL } from '../constants';
import { connect } from 'react-redux';

class RecuperarClave extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            idDNI: '',
            cip: '',
            idToken: '',
            code: '',
            password: '',

            validData: false,
            validCip: true,
            validToken: false,
            validPassword: false,
            message: '',
        }

        this.props.navigation.setOptions({
            title: 'Recuperar Contraseña',
            headerTitle: 'Recuperar Contraseña',
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleAlign: 'center',
            headerTitleStyle: {
                ...FONTS.h3,
                fontWeight: 'bold',
                textAlign: 'center',
                textAlignVertical: 'center',
                flex: 1,
            }
        });

        this.cipRef = React.createRef();
        this.tokenRef = React.createRef();
        this.claveRef = React.createRef();
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    componentDidMount() {

    }

    async validCip() {
        if (this.state.validData) {
            return;
        }

        if (this.state.cip.length == '') {
            Alert.alert("Restaurar Clave", "Ingrese su n° Cip.");
            this.claveRef.current.focus();
            return;
        }

        try {
            await this.setStateAsync({ validData: true, message: "Procesando datos..." });

            let result = await axios.post(URL.VALIDAR_CIP_PERSONA, {
                "cip": this.state.cip
            });
        
            await this.setStateAsync({
                validData: false,
                validCip: false,
                validToken: true,
                idDNI: result.data.user.idDNI,
                idToken: result.data.token
            });
        } catch (error) {
            if(error.response){
                Alert.alert("Resturar Clave", error.response.data);
            }else{
                Alert.alert("Resturar Clave", "Se produjo un error interno, intente nuevamente en un par de minutos.");
            }
            await this.setStateAsync({
                validData: false
            });
        }
    }

    async validToken() {
        if (this.state.validData) {
            return;
        }

        if (this.state.code.length == '') {
            Alert.alert("Restaurar Clave", "Ingrese el código de verificación.");
            this.tokenRef.current.focus();
            return;
        }

        try {
            await this.setStateAsync({ validData: true, message: "Validando código..." });
            
            await axios.post(URL.VALIDAR_TOKEN_PERSONA, {
                "code": this.state.code,
                "idToken": this.state.idToken
            });
            
            await this.setStateAsync({
                validData: false,
                validCip: false,
                validToken: false,
                validPassword: true
            });
        } catch (error) {
            if(error.response){
                Alert.alert("Resturar Clave", error.response.data);
            }else{
                Alert.alert("Resturar Clave", "Se produjo un error interno, intente nuevamente en un par de minutos.");
            }
            await this.setStateAsync({
                validData: false
            });
        }
    }

    async savePassword() {
        if (this.state.validData) {
            return;
        }


        if (this.state.password.length == '') {
            Alert.alert("Restaurar Clave", "Ingrese su nueva contraseña.");
            this.tokenRef.current.focus();
            return;
        }

        try {
            await this.setStateAsync({ validData: true, message: "Validando código..." });

            let result = await axios.post(URL.VALIDAR_SAVE_PERSONA, {
                "password": this.state.password,
                "idDNI": this.state.idDNI
            });
            
            await this.setStateAsync({
                validData: false,
                validCip: false,
                validToken: false,
                validPassword: true
            });

            Alert.alert("Resturar Clave", result.data,[
                { text: "OK", onPress: () =>  this.props.navigation.navigate("Login") }
            ]);
        } catch (error) {
            if(error.response){
                Alert.alert("Resturar Clave", error.response.data);
            }else{
                Alert.alert("Resturar Clave", "Se produjo un error interno, intente nuevamente en un par de minutos.");
            }
            await this.setStateAsync({
                validData: false
            });
        }
    }

    render() {
        return (
            <ImageBackground
                source={images.fondoLogin}
                style={css.imageBackground}>

                <SafeAreaView style={css.safeAreaView}>
                    <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                    <ScrollView
                        contentContainerStyle={css.scrollView}
                        keyboardShouldPersistTaps='handled'>

                        <View style={css.content}>
                            {/* SECCCIÓN DEL HEADER */}
                            <Image
                                source={images.logoCIPColor}
                                style={css.logo}
                            />

                            <Text style={{ ...FONTS.text_tittle, marginBottom: 20 }}>
                                CONSEJO DEPARTAMENTAL DE JUNÍN
                            </Text>
                            {/*  */}

                            {
                                this.state.validData ?
                                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                        <ActivityIndicator size="large" color={COLORS.primary} />
                                        <Text style={{ ...FONTS.h3 }}>{this.state.message}</Text>
                                    </View>
                                    : null
                            }

                            {
                                this.state.validCip ?
                                    <>
                                        <Text style={{
                                            ...FONTS.h4,
                                            color: COLORS.primary,
                                            textAlign: 'center'
                                        }}>
                                            Si es ingeniero colegiado en el CIP CD Junín, ingrese su Colegiatura (CIP)
                                        </Text>

                                        <View style={[css.inputContent, { width: 200 }]}>
                                            <FontAwesome
                                                name="user-o"
                                                color={COLORS.secondary}
                                                size={20}
                                            />
                                            <TextInput
                                                autoFocus={true}
                                                ref={this.cipRef}
                                                value={this.state.dni}
                                                placeholderTextColor="#666666"
                                                onChangeText={(text) => this.setState({ cip: text })}
                                                style={css.inputText}
                                                placeholder="Ingrese su N° CIP "
                                                keyboardType="numeric"
                                                onSubmitEditing={() => this.validCip()} />
                                            {
                                                this.state.cip !== "" ?
                                                    <Animatable.View
                                                        animation="bounceIn">
                                                        <Feather
                                                            name="check-circle"
                                                            color={COLORS.primary}
                                                            size={20}
                                                        />
                                                    </Animatable.View>
                                                    :
                                                    <Animatable.View
                                                        animation="bounceIn">
                                                        <Feather
                                                            name="info"
                                                            color={COLORS.gray}
                                                            size={20}
                                                        />
                                                    </Animatable.View>
                                            }

                                        </View>

                                        <TouchableOpacity
                                            style={css.buttonPrimary}
                                            onPress={() => this.validCip()}>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>ENVIAR</Text>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    this.state.validToken ?
                                        <>
                                            <Text style={{
                                                ...FONTS.h4,
                                                color: COLORS.primary,
                                                textAlign: 'center'
                                            }}>
                                                Ingresa el código de verificación que fue enviado a tu correo electrónico previamente registrado.
                                            </Text>

                                            <View style={[css.inputContent, { width: 200 }]}>
                                                <FontAwesome
                                                    name="arrow-right"
                                                    color={COLORS.secondary}
                                                    size={20}
                                                />
                                                <TextInput
                                                    ref={this.tokenRef}
                                                    value={this.state.dni}
                                                    placeholderTextColor="#666666"
                                                    onChangeText={(text) => this.setState({ code: text })}
                                                    style={css.inputText}
                                                    placeholder="Ingrese su código de verificación."
                                                    keyboardType="numeric"
                                                    onSubmitEditing={() => this.validToken()} />
                                                {
                                                    this.state.code !== "" ?
                                                        <Animatable.View
                                                            animation="bounceIn">
                                                            <Feather
                                                                name="check-circle"
                                                                color={COLORS.primary}
                                                                size={20}
                                                            />
                                                        </Animatable.View>
                                                        :
                                                        <Animatable.View
                                                            animation="bounceIn">
                                                            <Feather
                                                                name="info"
                                                                color={COLORS.gray}
                                                                size={20}
                                                            />
                                                        </Animatable.View>
                                                }

                                            </View>

                                            <TouchableOpacity
                                                style={css.buttonPrimary}
                                                onPress={() => this.validToken()}>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>VALIDAR</Text>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <>
                                            <Text style={{
                                                ...FONTS.h4,
                                                color: COLORS.primary,
                                                textAlign: 'center'
                                            }}>
                                                Ingresa su nueva contraseña.
                                            </Text>

                                            <View style={[css.inputContent, { width: 200 }]}>
                                                <FontAwesome
                                                    name="lock"
                                                    color={COLORS.secondary}
                                                    size={20}
                                                />
                                                <TextInput
                                                    ref={this.claveRef}
                                                    value={this.state.dni}
                                                    placeholderTextColor="#666666"
                                                    onChangeText={(text) => this.setState({ password: text })}
                                                    style={css.inputText}
                                                    autoCapitalize="none"
                                                    placeholder="Ingresa su nueva contraseña."
                                                    onSubmitEditing={() => this.savePassword()} />
                                                {
                                                    this.state.password !== "" ?
                                                        <Animatable.View
                                                            animation="bounceIn">
                                                            <Feather
                                                                name="check-circle"
                                                                color={COLORS.primary}
                                                                size={20}
                                                            />
                                                        </Animatable.View>
                                                        :
                                                        <Animatable.View
                                                            animation="bounceIn">
                                                            <Feather
                                                                name="info"
                                                                color={COLORS.gray}
                                                                size={20}
                                                            />
                                                        </Animatable.View>
                                                }

                                            </View>

                                            <TouchableOpacity
                                                style={css.buttonPrimary}
                                                onPress={() => this.savePassword()}>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>GUARDAR</Text>
                                            </TouchableOpacity>
                                        </>
                            }
                        </View>
                    </ScrollView>
                </SafeAreaView>

            </ImageBackground>
        );
    }
}

const css = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
        marginBottom: 10
    },
    inputText: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        ...FONTS.p
    },
    buttonPrimary: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
    marginVertical10: {
        marginVertical: 10,
    },
    footerContent: {
        paddingVertical: 20,
        flexDirection: 'row',
    },
    footerIntent: {
        width: '50%',
        alignItems: 'center'
    },
    footerButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerImagen: {
        width: 12,
        height: 12,
        marginHorizontal: 10,
        resizeMode: 'stretch',
    },
    footerText: {
        ...FONTS.h4,
        fontWeight: 'bold'
    }
});

const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}


export default connect(mapStateToProps)(RecuperarClave);