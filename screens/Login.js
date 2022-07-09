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
  Linking,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fetch_timeout } from './tools/Tools';
import { images, COLORS, FONTS, URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import openMap from 'react-native-open-maps';
import { signIn } from './actions/persona';

// const windowWidth = Dimensions.get('window').width;
// const windowHieght = Dimensions.get('window').height;

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
      clave: '',
      isVisiblePassword: false,
      isLogin: false,
      // isPortrait: windowHieght > windowWidth
    }
    this.refUsuario = React.createRef();
    this.refClave = React.createRef();
    // this.subscription;
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  componentDidMount() {
    // this.subscription = Dimensions.addEventListener('change', async (result) => {
    //   await this.setStateAsync({ isPortrait: result.screen.height > result.screen.width });

    // });
  }

  componentWillUnmount() {
    // if (this.subscription !== null) this.subscription.remove();
    // Dimensions.removeEventListener('change', () => { this });
  }

  async onEventLogin() {
    if (this.state.usuario.trim().length == 0 && this.state.clave.trim().length == 0) {
      Alert.alert("Login", "Ingrese su n° cip y su contraseña");
      this.refUsuario.current.focus();
      return;
    }
    if (this.state.usuario.trim().length == 0) {
      this.refUsuario.current.focus();
      return;
    }
    if (this.state.clave.trim().length == 0) {
      this.refClave.current.focus();
      return;
    }

    if (this.state.isLogin) {
      return;
    }

    try {
      await this.setStateAsync({ isLogin: true });
 
      let result = await fetch_timeout(URL.LOGIN_PERSONA, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "usuario": this.state.usuario.trim(),
          "clave": this.state.clave.trim()
        })
      });

      if (result.state == 0) {
        await this.setStateAsync({ isLogin: false });
        Alert.alert("Alerta", result.message);
      } else {
        if (result.state == 1) {
          await AsyncStorage.setItem('user', JSON.stringify(result.persona));
          await this.setStateAsync({ isLogin: false });
          this.props.addToken(JSON.stringify(result.persona));
        } else {
          await this.setStateAsync({ isLogin: false });
          Alert.alert("Alerta", result.message);
        }
      }
    } catch (error) {
      await this.setStateAsync({ isLogin: false });
      Alert.alert("Alerta", "Se genero un problema, intente nuevamente en un par de minutos.");
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

  async eventOpenContactanos() {
    this.props.navigation.navigate("ContactenosLogin")
  }

  async eventOpenCredenciales() {
    this.props.navigation.navigate('Credenciales')
  }

  async eventOpenRecuperar() {
    this.props.navigation.navigate("Recuperar")
  }

  render() {
    return (
      <ImageBackground
        source={images.fondoLogin}
        style={css.imageBackground}>

        <SafeAreaView style={css.safeAreaView}>
          <StatusBar barStyle="dark-content" translucent backgroundColor='transparent' />
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

              {/* SECCIÓN DEL BODY */}

              <Text style={{ ...FONTS.h4, color: COLORS.primary }}>INICIAR SESIÓN</Text>

              {
                this.state.isLogin ?
                  <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ ...FONTS.h4 }}>Validando datos...</Text>
                  </View>
                  : null
              }

              {/* TEXT USUARIO */}
              <View style={[css.inputContent, { width: 200 }]}>
                <FontAwesome
                  name="user-o"
                  color={COLORS.secondary}
                  size={20}
                />
                <TextInput
                  autoFocus={true}
                  ref={this.refUsuario}
                  placeholder="Ingrese N° CIP o Dni"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  style={css.inputText}
                  onChangeText={(text) => { this.setState({ usuario: text }) }}
                  value={this.state.usuario}
                  onSubmitEditing={() => this.onEventLogin()}
                />
                {
                  this.state.usuario !== "" ?
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

              {/* TEXT CONTRASEÑA */}
              <View style={[css.inputContent, { width: 200 }]}>
                <FontAwesome
                  name="lock"
                  color={COLORS.secondary}
                  size={22}
                />
                <TextInput
                  ref={this.refClave}
                  placeholder="Ingrese su Contraseña"
                  placeholderTextColor="#666666"
                  autoCapitalize="none"
                  secureTextEntry={!this.state.isVisiblePassword}
                  style={css.inputText}
                  value={this.state.clave}
                  onChangeText={(text) => { this.setState({ clave: text }) }}
                  onSubmitEditing={() => this.onEventLogin()}
                />
                <TouchableOpacity
                  onPress={() => this.setState({ isVisiblePassword: !this.state.isVisiblePassword })}
                >
                  {this.state.isVisiblePassword ?
                    <Feather
                      name="eye-off"
                      color="grey"
                      size={20}
                    />
                    :
                    <Feather
                      name="eye"
                      color="grey"
                      size={20}
                    />
                  }
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={css.buttonPrimary}
                onPress={() => this.onEventLogin()}>
                <Text style={{ ...FONTS.h4, color: COLORS.white }}>
                  INGRESAR
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => this.eventOpenCredenciales()}
                style={css.marginVertical10}>
                <Text style={{ ...FONTS.h4, textDecorationLine: 'underline' }}>
                  Solicita tus credenciales
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.eventOpenRecuperar()}
                style={css.marginVertical10}>
                <Text style={{ ...FONTS.h4, color: COLORS.blue, textDecorationLine: 'underline' }}>
                  ¿Olvido su contraseña?
                </Text>
              </TouchableOpacity>
              {/*  */}

              {/* SECCIÓN DEL FOOTER*/}
              <View style={css.footerContent}>
                <View style={css.footerIntent}>
                  <TouchableOpacity
                    onPress={() => this.eventOpenContactanos()}
                    style={css.footerButton}>
                    <Image
                      source={images.phoneIcon}
                      style={css.footerImagen}
                    />
                    <Text style={css.footerText}>Contáctenos</Text>
                  </TouchableOpacity>
                </View>

                <View style={css.footerIntent}>
                  <TouchableOpacity
                    onPress={() => this.oventOpenMaps()}
                    style={css.footerButton}>
                    <Image
                      source={images.placeIcon}
                      style={css.footerImagen}
                    />
                    <Text style={css.footerText}>Ubicanos</Text>
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

const mapDispatchToProps = (dispatch) => {
  return {
    addToken: (persona) => dispatch(signIn(persona))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);