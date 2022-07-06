import React from 'react';
import { Image, Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, icons, FONTS, images } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { signOut } from '../screens/actions/persona';
import HeaderTab from './components/HeaderTab';

class Servicios extends React.Component {

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

    onEventPagoCuota = () => {
        this.props.navigation.navigate('PagoCuota')
    }

    onEventCertHabilidad = () => {
        this.props.navigation.navigate('PagoCertHabilidad')
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
                <HeaderTab onEventCloseSession={this.onEventCloseSession} />

                <View style={styles.contenedorTitulo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={icons.pagos}
                            resizeMode='contain'
                            style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                        <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                            Servicios
                        </Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>

                            <TouchableOpacity style={[styles.box, styles.box1]} onPress={this.onEventPagoCuota}>
                                <Image source={icons.cuenta} style={{ width: 24, height: 24, tintColor: COLORS.secondary }} />
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>Pagar Cuota Social</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.box, styles.box2]} onPress={this.onEventCertHabilidad}>
                                <Image source={icons.certHabilidad} style={{ width: 24, height: 24, tintColor: COLORS.secondary }} />
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>Cert. de Habilidad</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={[styles.box, styles.box3]} onPress={() => { }}>
                                <Image source={icons.certObra} style={{ width: 24, height: 24, tintColor: COLORS.secondary }} />
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>Cert. de Obra</Text>
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}></Text>
                            </TouchableOpacity> */}

                            {/* <TouchableOpacity style={[styles.box, styles.box4]} onPress={() => { }}>
                                <Image source={icons.certProyecto} style={{ width: 24, height: 24, tintColor: COLORS.secondary }} />
                                <Text style={{ ...FONTS.h4, color: COLORS.secondary, textAlign: 'center' }}>Cert. de Proyecto</Text>
                            </TouchableOpacity> */}

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20
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
        width: 140,
        height: 140,
        backgroundColor: COLORS.white,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    box1: {
        borderBottomWidth: 3,
        borderBottomColor: "#6FBF3B"
    },
    box2: {
        borderBottomWidth: 3,
        borderBottomColor: "#F43F37"
    },
    box3: {
        borderBottomWidth: 3,
        borderBottomColor: "#FAEE58"
    },
    box4: {
        borderBottomWidth: 3,
        borderBottomColor: "#2465E5"
    },
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


export default connect(mapStateToProps, mapDispatchToProps)(Servicios);