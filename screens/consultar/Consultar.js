import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, icons, FONTS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { signOut } from '../actions/persona';
import HeaderTab from '../components/HeaderTab';

class Consultar extends React.Component {

  constructor(props) {
    super(props);

  }

  onEventCloseSession = async () => {
    try {
      await AsyncStorage.removeItem('user');
      this.props.removeToken();
    } catch (e) {
      this.props.removeToken();
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
        <HeaderTab onEventCloseSession={this.onEventCloseSession} />

        <View style={styles.contenedorTitulo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.comprobantes}
              resizeMode='contain'
              style={{ width: 24, height: 24, tintColor: COLORS.black }} />
            <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
              Consultar Documentos
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            <TouchableOpacity style={styles.box1} onPress={() => this.props.navigation.navigate('Comprobantes')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={icons.cuenta} style={styles.icon1} />
                <Text style={{ ...FONTS.h4, color: COLORS.white }}>Compro. de Pago</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => this.props.navigation.navigate('CertHabilidad')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Cert. Habilidad</Text>
                <Image source={icons.certHabilidad} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box1} onPress={() => this.props.navigation.navigate('CertObra')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={icons.certObra} style={styles.icon1} />
                <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cert. Obra</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => this.props.navigation.navigate('CertProyecto')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...FONTS.h4, color: COLORS.secondary }}>Cert. Proyecto</Text>
                <Image source={icons.certProyecto} style={styles.icon} />
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>

      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',

  },
  contenedorTitulo: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  box1: {
    minWidth: '70%',
    backgroundColor: COLORS.green,
    paddingHorizontal: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.green,
    borderWidth: 1,
    marginBottom: 20,
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
  box: {
    minWidth: '70%',
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  icon1: {
    width: 20,
    height: 20,
    resizeMode: 'stretch',
    marginRight: 50,
    tintColor: COLORS.white
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'stretch',
    marginLeft: 50,
    tintColor: COLORS.secondary
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


export default connect(mapStateToProps, mapDispatchToProps)(Consultar);

