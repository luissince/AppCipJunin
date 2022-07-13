import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { COLORS, SIZES, icons, FONTS, images, URL } from '../constants';
import { formatMoney, getDateFormaMMYY, fetch_timeout } from './tools/Tools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { signOut, addEmail } from '../screens/actions/persona';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      reload: false,
      estado: 0,
      cip: '',
      message: 'Cargando información...',
      apellidos: '',
      nombres: '',
      especialidad: '',
      capitulo: '',
      condicion: '',
      habilidad: '',
      ultimaCuota: '0000-00-00',
      habilidadHasta: '0000-00-00',
      cumplirTreinta: 0,
      deuda: 0,
      token: JSON.parse(this.props.token.userToken),
      refreshing: false,
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  onEventCloseSession = async () => {
    try {
      await AsyncStorage.removeItem('user');
      this.props.removeToken();
    } catch (e) {
      this.props.removeToken();
    }
  }

  componentDidMount() {
    this.loadInformacion();
  }

  async loadInformacion() {
    try {
      await this.setStateAsync({ isLoading: false, reload: false, message: 'Cargando información...' });
      let result = await fetch_timeout(URL.INFORMACION_PERSONA, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "idDni": this.state.token.idDNI,
          "mes": 0,
          "yearCurrentView": "",
          "monthCurrentView": ""
        })
      }, 10000);

      if (result.state == 0) {
        await this.setStateAsync({
          isLoading: false,
          message: result.message,
          reload: true
        });
      } else {
        if (result.state == 1) {
          this.props.addEmail(result.email);
          await this.setStateAsync({
            isLoading: true,
            reload: false,
            estado: 1,
            cip: result.persona.CIP,
            apellidos: result.persona.Apellidos,
            nombres: result.persona.Nombres,
            especialidad: result.persona.Especialidad,
            capitulo: result.persona.Capitulo,
            condicion: result.persona.Condicion,
            habilidad: result.persona.Habilidad,
            ultimaCuota: result.persona.FechaUltimaCuota,
            habilidadHasta: result.persona.HabilitadoHasta,
            cumplirTreinta: result.persona.CumplirTreinta,
            deuda: result.deuda
          });
        } else {
          await this.setStateAsync({
            isLoading: true,
            message: result.message,
            estado: result.state,
            reload: false
          });
        }
      }
    } catch (error) {
      await this.setStateAsync({
        isLoading: true,
        message: "Se genero un problema, intente nuevamente en un par de minutos.",
        estado: 0,
        reload: false
      });
    }
  }

  renderNotice() {
    return (
      <View style={{
        marginTop: SIZES.padding,
        marginHorizontal: SIZES.padding,
        padding: 20,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Nuevas noticias</Text>
        <Text style={{ marginTop: SIZES.base, color: COLORS.secondary, ...FONTS.body4, lineHeight: 18 }}>En esta sección se va estar plublicando nuevas noticias del colegio.</Text>
        <TouchableOpacity style={{ marginTop: SIZES.base }}
          onPress={() => { }}>
          <Text style={{ textDecorationLine: 'underline', ...FONTS.body5, color: COLORS.white }}>Leer mas...</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAlert() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: SIZES.padding,
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.white,
          borderRadius: SIZES.radius,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          source={icons.notification}
          style={{
            width: 24,
            height: 24,
            tintColor: COLORS.yellow
          }}
        />
        <View style={{ flex: 1, marginLeft: SIZES.radius }}>
          <Text style={{ ...FONTS.h4 }}>Alertas</Text>
          <Text style={{ ...FONTS.body5 }}>No hay alertas por el momento.</Text>
        </View>

        <Image
          source={icons.chevron}
          style={{
            width: 25,
            height: 25,
            tintColor: COLORS.gray
          }}
        />
      </TouchableOpacity>
    );
  }

  renderHeader() {
    return (
      <View style={{
        width: '100%',
        backgroundColor: COLORS.lightGray,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <ImageBackground
          source={images.fondo}
          resizeMode='cover'
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 20
          }}>

          {/* Header bar */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              width: '100%',
              alignItems: 'flex-end',
              paddingHorizontal: SIZES.padding
            }}>
            <TouchableOpacity
              style={{
                width: 24,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={this.onEventCloseSession} >
              <Image
                source={icons.turnoff} resizeMode='contain'
                style={{ flex: 1, tintColor: COLORS.white }}
              />
            </TouchableOpacity>
          </View>
          {/*  */}

          {/* Information */}
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 5 }}>
            <Text selectable={true} style={{ color: COLORS.white, ...FONTS.h3 }}>N° CIP : {this.state.cip}</Text>
            <Text selectable={true} style={{ marginTop: SIZES.base, color: COLORS.white, ...FONTS.h1, textAlign: 'center' }}>Ing. {this.state.apellidos + ", " + this.state.nombres}</Text>
            <Text selectable={true} style={{ color: COLORS.white, ...FONTS.body4 }}>Su Condición : {this.state.condicion}</Text>
            <Text selectable={true} style={{ color: COLORS.white, ...FONTS.body5 }}>{this.state.cumplirTreinta <= 0 ? '30 años cumplidos' : (this.state.cumplirTreinta + ' años para ser Vitalicio')}</Text>
          </View>
          {/*  */}


        </ImageBackground>
      </View>
    );
  }

  renderBoxes() {
    return (
      <View style={{ paddingHorizontal: 20, marginTop: SIZES.padding }}>

        <View style={styles.box}>
          <View style={styles.boxBody}>
            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
              <Text style={styles.boxTitle}>Su Estado</Text>
              <Image source={this.state.habilidad == 1 ? icons.ok : icons.warning} style={styles.boxImage} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.boxSubTitle}>{this.state.habilidad == 1 ? "HABILITADO" : "NO HABILITADO"}</Text>
            </View>
          </View>

          <View style={styles.boxBody}>
            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
              <Text style={styles.boxTitle}>Su Deuda</Text>
              <Image source={icons.moneyBag} style={styles.boxImage} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text selectable={true} style={styles.boxSubTitle}>S/ {formatMoney(this.state.deuda)}</Text>
            </View>
          </View>
        </View>


        <View style={styles.box}>
          <View style={styles.boxBody}>
            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
              <Text style={styles.boxTitle}>Ult. Cuota</Text>
              <Image source={icons.calendar} style={styles.boxImage} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text selectable={true} style={styles.boxSubTitle}>{getDateFormaMMYY(this.state.ultimaCuota)}</Text>
            </View>
          </View>

          <View style={styles.boxBody}>
            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
              <Text style={styles.boxTitle}>Hábil Hasta</Text>
              <Image source={icons.calendar} style={styles.boxImage} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text selectable={true} style={styles.boxSubTitle}>{getDateFormaMMYY(this.state.habilidadHasta)}</Text>
            </View>
          </View>
        </View>
      </View >
    );
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
    this.loadInformacion();
  }
  onEventReload() {
    this.loadInformacion();
  }

  render() {
    return (

      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

        {
          !this.state.isLoading ?
            (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center', marginBottom: 10 }}>{this.state.message}</Text>
                {
                  this.state.reload ?
                    (
                      <TouchableOpacity onPress={() => this.onEventReload()} style={{ flexDirection: 'row' }}>
                        <Image
                          source={icons.reload}
                          resizeMode='contain'
                          style={{ width: 20, height: 20, tintColor: COLORS.blue, marginRight: 5 }} />
                        <Text style={{ ...FONTS.h4, textDecorationLine: 'underline' }}>Actualizar Vista</Text>
                      </TouchableOpacity>
                    ) : null
                }
              </View>
            )
            :
            this.state.estado == 1 ?
              (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.onRefresh()}
                    />
                  }>
                  <View style={{ flex: 1, paddingBottom: 20 }}>
                    {this.renderHeader()}
                    {this.renderBoxes()}
                    {this.renderAlert()}
                    {/* {this.renderNotice()} */}
                  </View>
                </ScrollView>
              )
              :
              (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={icons.information}
                    resizeMode='contain'
                    style={{ width: 38, height: 38 }} />
                  <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center', marginBottom: 10 }}>{this.state.message}</Text>
                  <TouchableOpacity onPress={() => this.onEventReload()} style={{ flexDirection: 'row' }}>
                    <Image
                      source={icons.reload}
                      resizeMode='contain'
                      style={{ width: 20, height: 20, tintColor: COLORS.blue, marginRight: 5 }} />
                    <Text style={{ ...FONTS.h4, textDecorationLine: 'underline' }}>Actualizar Vista</Text>
                  </TouchableOpacity>
                </View>
              )
        }

      </SafeAreaView >
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  contenedorTitulo: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  box: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  boxBody: {
    width: '48%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white, shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxImage: {
    width: 26,
    height: 26,
    marginHorizontal: 5
  },
  boxTitle: {
    ...FONTS.body5,
    color: COLORS.grayDark
  },
  boxSubTitle: {
    ...FONTS.h4,
    color: COLORS.secondary,
    textDecorationLine: 'underline'
  }
});

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeToken: () => dispatch(signOut()),
    addEmail: (email) => dispatch(addEmail(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
