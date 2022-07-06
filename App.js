import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Login,
  Credenciales,
  EstadoCuenta,
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
  RestaurarClave
} from './screens';
import Tabs from './navigation/tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { restoreToken } from './screens/actions/persona';
// import RNFS from 'react-native-fs';

const Stack = createStackNavigator();

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      let userToken = await AsyncStorage.getItem('user');
      this.props.restore(userToken);
    } catch (e) {
      this.props.restore(null);
    }
  }

  render() {
    return (
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
                  <Stack.Screen name="EstadoCuenta" component={EstadoCuenta} />
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
                </>
              )
          }
        </Stack.Navigator>
      </NavigationContainer>
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

