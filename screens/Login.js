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
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  StatusBar
} from 'react-native';
import { fetch_timeout } from './tools/Tools';
import { images, COLORS, FONTS, SIZES, URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import openMap from 'react-native-open-maps';
import { signIn } from './actions/persona';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
      clave: '',
      isVisiblePassword: false,
      isLogin: false,
    }
    this.refUsuario = React.createRef();
    this.refClave = React.createRef();
  }

  onEventLogin() {
    if (this.state.usuario.trim().length == 0 && this.state.clave.trim().length == 0) {
      Alert.alert("Login", "Ingrese su n° cip y su contraseña");
      this.refUsuario.current.focus();
    } else {
      if (this.state.usuario.trim().length == 0) {
        this.refUsuario.current.focus();
      } else if (this.state.clave.trim().length == 0) {
        this.refClave.current.focus();
      } else {
        if (!this.state.isLogin) {
          this.setState({ isLogin: true });
          fetch_timeout(URL.LOGIN_PERSONA, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "usuario": this.state.usuario.trim(),
              "clave": this.state.clave.trim()
            })
          }).then(async result => {
            if (result.state == 0) {
              this.setState({ isLogin: false });
              Alert.alert("Alerta", result.message);
            } else {
              if (result.state == 1) {
                try {
                  await AsyncStorage.setItem('user', JSON.stringify(result.persona));
                  this.setState({ isLogin: false });
                  this.props.addToken(JSON.stringify(result.persona));
                } catch (error) {
                  this.setState({ isLogin: false });
                  Alert.alert("Alerta", "No se pudo guardar la información, intente nuevamente.");
                }
              } else {
                this.setState({ isLogin: false });
                Alert.alert("Alerta", result.message);
              }
            }
          });
        }
      }
    }
  }

  async oventOpenMaps() {
    try {
      const latitude = -12.061817337706508;
      const longitude = -75.2034517465679;
      const label = "Colegio De Ingenieros Del Perú, Francisco Solano, Huancayo 12001, Peru";

      // let url = Platform.OS === 'ios' ? "maps:" + latitude + "," + longitude + "?q=" + label : "geo:" + latitude + "," + longitude + "?q=" + label;

      // let supported = await Linking.canOpenURL(url);
      // if (supported) {
      //   await Linking.openURL(url);
      // } else {
      //   Alert.alert("Alerta", "No se puede habrir está URL.");
      // }
      openMap({ latitude: latitude, longitude: longitude, query: label });
    } catch (err) {
      Alert.alert("Alerta", "La plataforma no puede acceder al navegador.");
    }
  }

  async eventOpenUrl() {
    try {
      await Linking.openURL("https://www.cipvirtual.cip-junin.org.pe/identify");
    } catch (err) {
      Alert.alert("Alerta", "La plataforma no puede acceder al navegador.");
    }
  }

  render() {
    return (
      <ImageBackground source={images.fondoLogin} style={css.image}>
        <StatusBar barStyle="dark-content" translucent backgroundColor='transparent' />
        <ScrollView keyboardShouldPersistTaps='handled'>

          <View>
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
              this.state.isLogin ?
                <View style={{ alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={{ ...FONTS.h3 }}>Validando datos...</Text>
                </View>
                : null
            }

            <View style={{ alignItems: 'center', padding: 20 }}>
              <View style={{ flexDirection: 'row', width: 220, marginBottom: 20 }}>
                <TextInput
                  autoFocus={true}
                  ref={this.refUsuario}
                  style={css.input}
                  placeholder="Ingrese Número CIP o Dni"
                  keyboardType="numeric"
                  onChangeText={(text) => { this.setState({ usuario: text }) }}
                  value={this.state.usuario}
                  onSubmitEditing={() => this.onEventLogin()}
                />
              </View>

              <View style={{ flexDirection: 'row', width: 220 }}>
                <TextInput
                  ref={this.refClave}
                  style={css.input}
                  placeholder="Ingrese Su Contraseña"
                  onChangeText={(text) => { this.setState({ clave: text }) }}
                  value={this.state.clave}
                  secureTextEntry={!this.state.isVisiblePassword}
                  onSubmitEditing={() => this.onEventLogin()}
                />
                <TouchableOpacity
                  style={{ justifyContent: 'center' }}
                  onPress={() => this.setState({ isVisiblePassword: !this.state.isVisiblePassword })}>
                  <Image
                    source={
                      this.state.isVisiblePassword
                        ? images.eyesUnlock
                        : images.eyesLock
                    }
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={css.buttonAceptar}>
              <TouchableOpacity
                style={{
                  borderBottomLeftRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: COLORS.primary,
                  paddingVertical: 8,
                  paddingHorizontal: 30,
                }}
                onPress={() => this.onEventLogin()}>
                <Text style={{ ...FONTS.h4, color: COLORS.white }}>
                  INGRESAR
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Credenciales')}>
                <Text style={{ ...FONTS.h4, textDecorationLine: 'underline' }}>
                  Solicita tus credenciales
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 0 }}>
              <TouchableOpacity
                onPress={() => this.eventOpenUrl()}>
                <Text style={{ ...FONTS.h4, color: COLORS.blue, textDecorationLine: 'underline' }}>
                  ¿Olvido su contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingVertical: 20, flexDirection: 'row', }}>
              <View style={{ width: '50%', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => { this.props.navigation.navigate("ContactenosLogin") }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.phoneIcon}
                    style={{
                      width: 12,
                      height: 12,
                      marginHorizontal: 10,
                      resizeMode: 'stretch',
                    }}
                  />
                  <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Contáctenos</Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: '50%', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => { this.oventOpenMaps() }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.placeIcon}
                    style={{
                      width: 12,
                      height: 12,
                      marginHorizontal: 10,
                      resizeMode: 'stretch',
                    }}
                  />
                  <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Ubicanos</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 5 }}>
              <Text style={{ ...FONTS.h5, color: COLORS.grayDark }}>
                Versión 1.0.4
              </Text>
            </View>
          </View>

        </ScrollView>
      </ImageBackground>
    );
  }

}

const css = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#C1BFBF',
    paddingLeft: 10,
  },
  buttonAceptar: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToken: (persona) => dispatch(signIn(persona))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);