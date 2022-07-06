import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { fetch_timeout } from './tools/Tools';
import { COLORS, SIZES, icons, FONTS, images, URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { signOut } from '../screens/actions/persona';
import HeaderTab from './components/HeaderTab';

class Perfil extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      reload: false,
      message: '',
      cip: '',
      dni: '',
      apellidos: '',
      nombres: '',
      fechaNacimiento: '',
      sexo: '',
      especialidad: '',
      capitulo: '',
      condicion: '',
      habilidad: '',
      ultimaCuota: '',
      habilidadHasta: '',
      cumplirTreinta: 0,
      deuda: 0,
      image: '',
      token: JSON.parse(this.props.token.userToken),
      refreshing: false,
      buttonTabs: [
        {
          id: "btnColegiatura",
          styleButton: styles.itemButton,
          styleButtonSelect: styles.itemButtonSelect,
          styleText: styles.itemButtonText,
          styleTextSelect: styles.itemButtonTextSelect,
          select: true,
          text: "COLEGIATURA",
          vista:
            (<View style={styles.itemBox}>

              <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                <View style={styles.itemDetalle}>
                  <View style={styles.itemText}>
                    <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>COLEGIATURA</Text>
                  </View>
                </View>
              </View>

            </View>)
        },
        {
          id: "btnDomicilio",
          styleButton: styles.itemButton,
          styleButtonSelect: styles.itemButtonSelect,
          styleText: styles.itemButtonText,
          styleTextSelect: styles.itemButtonTextSelect,
          select: false,
          text: "DOMICILIO",
          vista:
            (<View style={styles.itemBox}>

              <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                <View style={styles.itemDetalle}>
                  <View style={styles.itemText}>
                    <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>DIRECCIÓN</Text>
                  </View>
                </View>
              </View>

            </View>)
        },
        {
          id: "btnTelefono",
          styleButton: styles.itemButton,
          styleButtonSelect: styles.itemButtonSelect,
          styleText: styles.itemButtonText,
          styleTextSelect: styles.itemButtonTextSelect,
          select: false,
          text: "TELEFONO",
          vista:
            (<View style={styles.itemBox}>

              <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                <View style={styles.itemDetalle}>
                  <View style={styles.itemText}>
                    <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>TELEFONO</Text>
                  </View>
                </View>
              </View>

            </View>)
        },
        {
          id: "btnCorreo",
          styleButton: styles.itemButton,
          styleButtonSelect: styles.itemButtonSelect,
          styleText: styles.itemButtonText,
          styleTextSelect: styles.itemButtonTextSelect,
          select: false,
          text: "CORREO Y WEB",
          vista:
            (<View style={styles.itemBox}>

              <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                <View style={styles.itemDetalle}>
                  <View style={styles.itemText}>
                    <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>CORREO Y WEB</Text>
                  </View>
                </View>
              </View>

            </View>)
        }
      ]
    }

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

  onEventReload() {
    this.loadInformacion();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
    this.loadInformacion();
  }

  loadInformacion() {
    this.setState({ isLoading: true, reload: false, message: 'Cargando información...', });
    fetch_timeout(URL.PERFIL_PERSONA, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "idDni": this.state.token.idDNI,
      })
    }, 6000).then(result => {
      if (result.state == 0) {
        this.setState({
          reload: true,
          message: result.message
        });
      } else {
        if (result.state == 1) {
          this.setState({
            isLoading: false,
            reload: false,
            cip: result.persona.CIP,
            dni: result.persona.idDNI,
            apellidos: result.persona.Apellidos,
            nombres: result.persona.Nombres,
            condicion: result.persona.Condicion,
            fechaNacimiento: result.persona.FechaNac,
            sexo: result.persona.Sexo == "M" ? "MASCULINO" : "FEMENINO",
            image: result.image == "" || result.image == null ? "" : 'data:image/png;base64,' + result.image
          });
          let newArray = this.state.buttonTabs.map((item) => item);

          if (result.colegiatura.length > 0) {
            newArray[0].vista = (
              result.colegiatura.map((item, index) => {
                return (<View key={index} style={styles.itemBox}>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>COLEGIATURA</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>SEDE:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Consejo}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>CAPÍTULO:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Capitulo}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>ESPECIALIDAD:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Especialidad}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>FECHA COLEGIADO:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.FechaColegiado}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>UNIVERSIDAD DE EGRESO:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.UnivesidadEgreso}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>FECHA DE EGRESO:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.FechaEgreso}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>UNIVERSIDAD DE TITULACIÓN:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Universidad}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>FECHA TITULACIÓN:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.FechaTitulacion}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 0, }]}>
                    <View style={styles.itemDetalle}>
                      <View style={styles.itemText}>
                        <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>RESOLUCIÓN:</Text>
                      </View>
                      <View style={styles.itemText}>
                        <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Resolucion}</Text>
                      </View>
                    </View>
                  </View>

                </View>
                )
              })
            );
          }

          if (result.domicilio.length > 0) {
            newArray[1].vista = (
              result.domicilio.map((item, index) => {
                return (
                  <View key={index} style={styles.itemBox}>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>DOMICILIO</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>TIPO:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Tipo}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>DIRECCIÓN:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Direccion}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 0, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>UBIGEO:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Ubigeo}</Text>
                        </View>
                      </View>
                    </View>

                  </View>)
              })
            );
          }

          if (result.telefono.length > 0) {
            newArray[2].vista = (
              result.telefono.map((item, index) => {
                return (
                  <View key={index} style={styles.itemBox}>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>TELEFONO</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>TIPO:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Tipo}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>NÚMERO:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Telefono}</Text>
                        </View>
                      </View>
                    </View>

                  </View>
                )
              })
            );
          }

          if (result.correoweb.length > 0) {
            newArray[3].vista = (
              result.correoweb.map((item, index) => {
                return (
                  <View key={index} style={styles.itemBox}>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>CORREO Y WEB</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>TIPO:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Tipo}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                      <View style={styles.itemDetalle}>
                        <View style={styles.itemText}>
                          <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>DIRECCIÓN:</Text>
                        </View>
                        <View style={styles.itemText}>
                          <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{item.Direccion}</Text>
                        </View>
                      </View>
                    </View>

                  </View>
                )
              })
            );
          }

          this.setState({ buttonTabs: newArray });
        } else {
          this.setState({
            reload: true,
            message: result.message
          });
        }
      }
    });
  }

  selectFocust(id, index) {
    let newArray = this.state.buttonTabs.map((item) => {
      item.select = false;
      return item;
    });
    if (newArray[index].id == id) {
      newArray[index].select = true;
    }
    this.setState({ buttonTabs: newArray });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
        <HeaderTab onEventCloseSession={this.onEventCloseSession} />

        <View style={styles.contenedorTitulo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.user}
              resizeMode='contain'
              style={{ width: 24, height: 24, tintColor: COLORS.black }} />
            <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
              Perfil
            </Text>
          </View>
        </View>

        {
          this.state.isLoading ?
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
            (
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.onRefresh()} />} >
                <View style={styles.container}>

                  <View style={{ alignItems: 'center', padding: SIZES.padding }}>
                    <View style={styles.image_avatar}>
                      <Image
                        source={this.state.image == "" ? images.avatar : { uri: this.state.image }}
                        resizeMode="contain"
                        style={{ width: 160, height: 160, }} />
                    </View>
                  </View>

                  {/* INFORMACIÓN GENERAL */}
                  <View style={{ paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding }}>
                    <View style={styles.itemBox}>
                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>INFORMACIÓN GENERAL</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>N° CIP:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.cip}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Condición:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.condicion}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>DNI:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.dni}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Apellidos:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.apellidos}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Nombres:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.nombres}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 1, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Fecha de Nacimiento:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.fechaNacimiento}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.itemContenedor, [{ borderBottomColor: '#D6D5D5', borderBottomWidth: 0, }]}>
                        <View style={styles.itemDetalle}>
                          <View style={styles.itemText}>
                            <Text style={{ ...FONTS.h4, color: COLORS.grayLight }}>Sexo:</Text>
                          </View>
                          <View style={styles.itemText}>
                            <Text selectable={true} style={{ ...FONTS.h4, color: COLORS.secondary, }}>{this.state.sexo}</Text>
                          </View>
                        </View>
                      </View>

                    </View>
                  </View>
                  {/*  */}

                  <View style={{ paddingHorizontal: SIZES.padding, marginBottom: 10 }}>
                    <View style={styles.itemButtonContent}>
                      {
                        this.state.buttonTabs.map((item, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              style={item.select ? item.styleButtonSelect : item.styleButton}
                              onPress={() => { this.selectFocust(item.id, index) }}>
                              <Text style={item.select ? item.styleTextSelect : item.styleText}>{item.text}</Text>
                            </TouchableOpacity>
                          );
                        })
                      }
                    </View>
                  </View>


                  <View style={{ paddingHorizontal: SIZES.padding }}>
                    {
                      this.state.buttonTabs.map((item, index) => {
                        return item.select ? <View key={index}>{item.vista}</View> : null;
                      })
                    }
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
    paddingVertical: SIZES.padding
  },
  contenedorTitulo: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'space-between'
  },
  image_avatar: {
    backgroundColor: COLORS.white,
    padding: 5,
    borderWidth: 1,
    borderColor: '#C0CAD0',
    borderRadius: SIZES.radius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemBox: {
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
  },
  itemContenedor: {
    width: '100%',
    flexDirection: 'column',
    padding: SIZES.padding,
    marginBottom: 10
  },
  itemDetalle: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10
  },
  itemText: {
    flexDirection: 'column'
  },
  itemButtonContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  itemButton: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.grayLight,
    borderTopWidth: 2
  },
  itemButtonSelect: {
    padding: 10,
    backgroundColor: COLORS.green,
    borderTopColor: COLORS.blue,
    borderTopWidth: 2
  },
  itemButtonText: {
    ...FONTS.h5,
    color: COLORS.secondary,
    textAlign: 'center'
  },
  itemButtonTextSelect: {
    ...FONTS.h5,
    color: COLORS.white,
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeToken: () => dispatch(signOut())
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
