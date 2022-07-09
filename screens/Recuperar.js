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
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetch_timeout, validateEmail } from './tools/Tools';
import { images, COLORS, FONTS, SIZES, URL } from '../constants';
import { connect } from 'react-redux';

class Recuperar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      idDNI: '',
      dni: '',
      cip: '',
      validData: false,
      register: false,
      validPassword: false,
      password: '',
      email: ''
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

    this.dniRef = React.createRef();
    this.cipRef = React.createRef();

    this.passwordRef = React.createRef();
    this.emailRef = React.createRef();
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  componentDidMount() {

  }

  async validDatos() {
    if (this.state.validData) {
      return;
    }
    if (this.state.dni.trim().length == 0 && this.state.cip.trim().length == 0) {
      Alert.alert("Validar", "Ingrese los datos requeridos");
      this.dniRef.current.focus();
      return;
    }

    if (this.state.dni.trim().length == 0) {
      this.dniRef.current.focus();
      return;
    }

    if (this.state.cip.trim().length == 0) {
      this.cipRef.current.focus();
      return;
    }

    try {
      await this.setStateAsync({ validData: true });
      let result = await fetch_timeout(URL.REGISTER_PERSONA, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "type": "valid",
          "dni": this.state.dni.trim(),
          "cip": this.state.cip.trim()
        })
      });

      if (result.state == 1) {
        let user = result.user;
        await this.setStateAsync({ idDNI: user.idDNI, validData: false, register: true });
        this.passwordRef.current.focus();
      } else {
        await this.setStateAsync({ validData: false });
        Alert.alert("Validar", result.message);
      }
    } catch (error) {
      await this.setStateAsync({ validData: false });
      Alert.alert("Validar", error);
    }

  }

  async validPassword() {
    if (this.state.validPassword) {
      return;
    }

    if (this.state.password.trim().length == 0 && this.state.email.trim().length == 0) {
      Alert.alert("Guardar", "Ingrese los datos requeridos");
      this.passwordRef.current.focus();
      return;
    }

    if (this.state.password.trim().length == 0) {
      this.passwordRef.current.focus();
      return;
    }

    if (!validateEmail(this.state.email.trim())) {
      this.emailRef.current.focus();
      return;
    }

    try {
      await this.setStateAsync({ validPassword: true });
      let result = await fetch_timeout(URL.REGISTER_PERSONA, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "type": "save",
          "idDNI": this.state.idDNI,
          "password": this.state.password.trim(),
          "email": this.state.email.trim()
        })
      });
      if (result.state == 1) {
        Alert.alert("Guardar", result.message, [{ text: "OK", onPress: () => this.props.navigation.navigate("Login") }]);
      } else {
        await this.setStateAsync({ validPassword: false });
        Alert.alert("Guardar", result.message);
      }
    } catch (error) {
      await this.setStateAsync({ validPassword: false });
      Alert.alert("Guardar", error);
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
                  <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ ...FONTS.h3 }}>Validando datos...</Text>
                  </View>
                  : null
              }
              {
                this.state.validPassword ?
                  <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ ...FONTS.h3 }}>Guardando datos...</Text>
                  </View>
                  : null
              }
              {
                !this.state.register ?
                  <>
                    {
                      !this.state.validData ?
                        <Text style={{ ...FONTS.h4, color: COLORS.primary, textAlign: 'center' }}>Si es ingeniero colegiado en el CIP CD Junín, ingrese su Colegiatura (CIP)</Text> : null
                    }

                    <View style={[css.inputContent, { width: 200 }]}>
                      <FontAwesome
                        name="user-o"
                        color={COLORS.secondary}
                        size={20}
                      />
                      <TextInput
                        autoFocus={true}
                        ref={this.dniRef}
                        value={this.state.dni}
                        placeholderTextColor="#666666"
                        onChangeText={(text) => this.setState({ dni: text })}
                        style={css.inputText}
                        placeholder="Ingrese su N° CIP "
                        keyboardType="numeric"
                        onSubmitEditing={() => this.validDatos()} />
                      {
                        this.state.dni !== "" ?
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
                      onPress={() => this.validDatos()}>
                      <Text style={{ ...FONTS.h4, color: COLORS.white }}>ENVIAR</Text>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    {
                      !this.state.validPassword ?
                        <Text style={{ ...FONTS.h4, color: COLORS.primary }}>REGISTRAR SU CONTRASEÑA.</Text> : null
                    }

                    <View style={[css.inputContent, { width: 200 }]}>
                      <FontAwesome
                        name="user-o"
                        color={COLORS.secondary}
                        size={20}
                      />
                      <TextInput
                        autoFocus={true}
                        ref={this.passwordRef}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text })}
                        style={css.inputText}
                        placeholder="Ingrese su contraseña."
                        placeholderTextColor="#666666"
                        onSubmitEditing={() => this.validPassword()} />
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

                    <View style={[css.inputContent, { width: 200 }]}>
                      <FontAwesome
                        name="at"
                        color={COLORS.secondary}
                        size={20}
                      />
                      <TextInput
                        ref={this.emailRef}
                        value={this.state.email}
                        placeholderTextColor="#666666"
                        onChangeText={(text) => this.setState({ email: text })}
                        style={css.inputText}
                        placeholder="Ingrese su correo electrónico."
                        onSubmitEditing={() => this.validPassword()} />
                      {
                        this.state.email !== "" ?
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
                      onPress={() => this.validPassword()}>
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


export default connect(mapStateToProps)(Recuperar);