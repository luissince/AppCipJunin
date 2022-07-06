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
import { fetch_timeout, validateEmail } from './tools/Tools';
import { images, COLORS, FONTS, SIZES, icons, URL } from '../constants';
import { connect } from 'react-redux';

class Credenciales extends React.Component {

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
      title: 'Solicitar Credenciales',
      headerTitle: 'Solicitar Credenciales',
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

  componentDidMount() {

  }

  async validDatos() {
    if (this.state.validData) {
      return;
    }
    if (this.state.dni.trim().length == 0 && this.state.cip.trim().length == 0) {
      Alert.alert("Validar", "Ingrese los datos requeridos");
      this.dniRef.current.focus();
    } else {
      if (this.state.dni.trim().length == 0) {
        this.dniRef.current.focus();
      } else if (this.state.cip.trim().length == 0) {
        this.cipRef.current.focus();
      } else {
        try {
          this.setState({ validData: true });
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
            this.setState({ idDNI: user.idDNI, validData: false, register: true }, () => {
              this.passwordRef.current.focus();
            });
          } else {
            Alert.alert("Validar", result.message);
            this.setState({ validData: false });
          }
        } catch (error) {
          this.setState({ validData: false });
          Alert.alert("Validar", error);
        }
      }
    }
  }

  async validPassword() {
    if (this.state.validPassword) {
      return;
    }
    if (this.state.password.trim().length == 0 && this.state.email.trim().length == 0) {
      Alert.alert("Guardar", "Ingrese los datos requeridos");
      this.passwordRef.current.focus();
    } else {
      if (this.state.password.trim().length == 0) {
        this.passwordRef.current.focus();
      } else if (!validateEmail(this.state.email.trim())) {
        this.emailRef.current.focus();
      } else {
        try {
          this.setState({ validPassword: true });
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
            Alert.alert("Guardar", result.message);
            this.setState({ validPassword: false });
          }
        } catch (error) {
          this.setState({ validPassword: false });
          Alert.alert("Guardar", error);
        }
      }
    }
  }

  render() {
    return (
      <View style={css.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />
        <ImageBackground source={images.fondoLogin} style={css.image}>
          <ScrollView keyboardShouldPersistTaps='handled'>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                  marginTop: SIZES.height * 0.1
                }}>
                <Image
                  source={images.logoCIPColor}
                  style={{ width: 120, height: 120 }}
                />
              </View>

              <View>
                <Text style={{ ...FONTS.text_tittle, marginBottom: 60 }}>
                  CONSEJO DEPARTAMENTAL DE JUNÍN
                </Text>
              </View>

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
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                      {
                        !this.state.validData ?
                          <Text style={{ ...FONTS.h3, textAlign: 'center' }}>Validar datos.</Text> : null
                      }
                    </View>
                    <View style={{ paddingHorizontal: 20, }}>
                      <TextInput
                        autoFocus={true}
                        ref={this.dniRef}
                        value={this.state.dni}
                        onChangeText={(text) => this.setState({ dni: text })}
                        style={css.input}
                        placeholder="Ingrese su N° Dni "
                        keyboardType="numeric"
                        onSubmitEditing={() => this.validDatos()} />
                    </View>

                    <View style={{ paddingHorizontal: 20, }}>
                      <TextInput
                        ref={this.cipRef}
                        value={this.state.cip}
                        onChangeText={(text) => this.setState({ cip: text })}
                        style={css.input}
                        placeholder="Ingrese su N° Cip"
                        keyboardType="numeric"
                        onSubmitEditing={() => this.validDatos()} />
                    </View>

                    <View style={css.buttonContent}>
                      <TouchableOpacity style={css.buttonStyle}
                        onPress={() => this.validDatos()}>
                        <Text style={{ ...FONTS.h4, color: COLORS.white }}>ENVIAR</Text>
                      </TouchableOpacity>
                    </View>


                  </View>
                  :
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                      {
                        !this.state.validPassword ?
                          <Text style={{ ...FONTS.h3, textAlign: 'center' }}>Registrar su contraseña.</Text> : null
                      }
                    </View>
                    <View style={{ paddingHorizontal: 20, }}>
                      <TextInput
                        autoFocus={true}
                        ref={this.passwordRef}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text })}
                        style={css.input}
                        placeholder="Ingrese su contraseña."
                        onSubmitEditing={() => this.validPassword()} />
                    </View>

                    <View style={{ paddingHorizontal: 20, }}>
                      <TextInput
                        ref={this.emailRef}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text })}
                        style={css.input}
                        placeholder="Ingrese su correo electrónico."
                        onSubmitEditing={() => this.validPassword()} />
                    </View>

                    <View style={css.buttonContent}>
                      <TouchableOpacity style={css.buttonStyle}
                        onPress={() => this.validPassword()}>
                        <Text style={{ ...FONTS.h4, color: COLORS.white }}>GUARDAR</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              }
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  input: {
    width: 240,
    height: 40,
    margin: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#C1BFBF',
    paddingLeft: 10,
  },
  buttonContent: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 30
  }
});

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}


export default connect(mapStateToProps)(Credenciales);