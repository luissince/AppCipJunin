import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { fetch_timeout } from './tools/Tools';
import { COLORS, SIZES, icons, FONTS, images, URL } from '../constants';

class ContactenosLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      reload: false,
      message: '',
      ruc: '',
      razonSocial: '',
      email: '',
      horarioAtencion: '',
      direccion: '',
      celular: '',
      telefono: '',
      paginaWeb: '',
      refreshing: false,
    }
    this.props.navigation.setOptions({
      title: 'Contáctenos',
      headerTitle: 'Contáctenos',
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
      },
    });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
    this.loadInformacion();
  }

  onEventReload() {
    this.loadInformacion();
  }

  componentDidMount() {
    this.loadInformacion();
  }

  async loadInformacion() {
    try {
      this.setState({ isLoading: true, reload: false, message: 'Cargando información...', });
      let result = await fetch_timeout(URL.INFORMACION_COLEGIO, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (result.state == 1) {
        this.setState({
          isLoading: false,
          reload: false,
          message: '',
          ruc: result.empresa.NumeroDocumento,
          razonSocial: result.empresa.RazonSocial,
          email: result.empresa.Email,
          horarioAtencion: result.empresa.Horario,
          direccion: result.empresa.Domicilio,
          celular: result.empresa.Celular,
          telefono: result.empresa.Telefono,
          paginaWeb: result.empresa.PaginaWeb
        });
      } else {
        this.setState({
          reload: true,
          message: result.message,
        });
      }
    } catch (error) {
      this.setState({
        reload: true,
        message: result.message,
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

        <View style={styles.contenedorTitulo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.contactanos}
              resizeMode='contain'
              style={{ width: 24, height: 24, tintColor: COLORS.black }} />
            <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
              Directorio Institucional
            </Text>
          </View>
        </View>

        {
          this.state.isLoading ?
            (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding }}>
                {

                  !this.state.reload ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
                }
                <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center', marginBottom: 10 }}>{this.state.message}</Text>
                {
                  this.state.reload ?
                    (
                      <TouchableOpacity onPress={() => { this.onEventReload() }} style={{ flexDirection: 'row' }}>
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
            (
              <ScrollView style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.onRefresh()} />} >
                <View style={styles.container}>

                  <View style={{ paddingBottom: 20, width: SIZES.width, height: SIZES.height * 0.25 }}>
                    <Image source={images.colegio} resizeMode='cover' style={{ width: SIZES.width, height: SIZES.height * 0.25 }} />
                  </View>

                  <View style={{ width: '100%', padding: 20 }}>
                    <View style={{
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
                    }}>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}>
                            <Image
                              source={icons.plus}
                              resizeMode='contain'
                              style={styles.itemIcon} /> R.U.C.:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.ruc}</Text>
                        </View>
                      </View>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}><Image
                            source={icons.company}
                            resizeMode='contain'
                            style={styles.itemIcon} /> Razón Social:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.razonSocial}</Text>
                        </View>
                      </View>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}>
                            <Image
                              source={icons.email}
                              resizeMode='contain'
                              style={styles.itemIcon} /> Correo Electrónico:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.email}</Text>
                        </View>
                      </View>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}><Image
                            source={icons.time}
                            resizeMode='contain'
                            style={styles.itemIcon} /> Horario de atención:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.horarioAtencion}</Text>
                        </View>
                      </View>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}><Image
                            source={icons.maps}
                            resizeMode='contain'
                            style={styles.itemIcon} /> Dirección:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.direccion}</Text>
                        </View>
                      </View>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}><Image
                            source={icons.phone}
                            resizeMode='contain'
                            style={styles.itemIcon} /> Celular/Teléfono:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.celular} {this.state.celular == "" ? "" : "/"} {this.state.telefono}</Text>
                        </View>
                      </View>

                      <View style={styles.itemContenedor}>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemTextIcon}><Image
                            source={icons.domain}
                            resizeMode='contain'
                            style={styles.itemIcon} /> Pagina Web:</Text>
                        </View>
                        <View style={styles.itemDetalle}>
                          <Text style={styles.itemText}>{this.state.paginaWeb}</Text>
                        </View>
                      </View>

                    </View>
                  </View>

                </View>
              </ScrollView>
            )
        }

      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 10
  },
  contenedorTitulo: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  itemContenedor: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 5,
    borderBottomColor: '#D6D5D5',
    borderBottomWidth: 1,
  },
  itemDetalle: {
    width: '100%',
    paddingVertical: 5
  },
  itemIcon: {
    tintColor: COLORS.grayLight,
    marginHorizontal: 5,
    width: 18,
    height: 18
  },
  itemTextIcon: {
    ...FONTS.h4,
    color: COLORS.grayLight,
  },
  itemText: {
    ...FONTS.h4,
    color: COLORS.black,
  }
});

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}


export default ContactenosLogin;


