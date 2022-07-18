import * as React from 'react';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Login,
  Credenciales,
  Comprobantes,
  SplashScreen,
  CrediCars,
  PagoCuota,
  ConfirmarPago,
  RespuestaPago,
  CertHabilidad,
  ContactenosLogin,
  CertObra,
  CertProyecto,
  CargarTarjeta,
  DocumentoPago,
  PagoCertHabilidad,
  RestaurarClave,
  PerfilActualizar,
  BusquedaColegiado,
  BolsaTrabajo
} from './screens';
import Tabs from './navigation/tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { sleep } from './screens/tools/Tools';
import { restoreToken } from './screens/actions/persona';
// import RNFS from 'react-native-fs';

const Stack = createStackNavigator();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unsubscribe: null,
    };
  }

  async componentDidMount() {
    try {
      await sleep(4000);
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        if (this.props.token.userToken !== null) {
          this.onDisplayNotification(remoteMessage);
        }
      });
      await this.setStateAsync({ unsubscribe: unsubscribe });

      let userToken = await AsyncStorage.getItem('user');
      this.props.restore(userToken);
    } catch (e) {
      this.props.restore(null);
    }
  }

  onDisplayNotification = async (remoteMessage) => {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default channels',
    });

    // Display a notification   
    await notifee.displayNotification({
      title: remoteMessage.data.title,
      subtitle: remoteMessage.data.subtitle,
      body: remoteMessage.data.body,
      android: {
        channelId: channelId
      }
    });
  }

  componentWillUnmount() {
    if (this.state.unsubscribe != null) {
      this.state.unsubscribe();
    }
  }

  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            {
              this.props.token.isLoading ? (
                <Stack.Screen
                  name="SplashScreen"
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
              ) : this.props.token.userToken == null ? (
                <>
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name="Credenciales" component={Credenciales} />
                  <Stack.Screen name="ContactenosLogin" component={ContactenosLogin} />
                  <Stack.Screen name="RestaurarClave" component={RestaurarClave} />
                </>
              ) :
                (
                  <>
                    <Stack.Screen
                      name="Inicio"
                      component={Tabs}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Comprobantes" component={Comprobantes} />
                    <Stack.Screen name="CertHabilidad" component={CertHabilidad} />
                    <Stack.Screen name="CertObra" component={CertObra} />
                    <Stack.Screen name="CertProyecto" component={CertProyecto} />
                    <Stack.Screen name="PagoCuota" component={PagoCuota} />
                    <Stack.Screen name="CrediCars" component={CrediCars} />
                    <Stack.Screen name="ConfirmarPago" component={ConfirmarPago} />
                    <Stack.Screen name="RespuestaPago" component={RespuestaPago} />
                    <Stack.Screen name="CargarTarjeta" component={CargarTarjeta} />
                    <Stack.Screen name="DocumentoPago" component={DocumentoPago} />
                    <Stack.Screen name="PagoCertHabilidad" component={PagoCertHabilidad} />
                    <Stack.Screen name="PerfilActualizar" component={PerfilActualizar} />
                    <Stack.Screen name="BusquedaColegiado" component={BusquedaColegiado} />
                    <Stack.Screen name="BolsaTrabajo" component={BolsaTrabajo} />
                  </>
                )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    restore: (persona) => dispatch(restoreToken(persona))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
//export default CrediCars;

