import React from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    TextInput
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { COLORS, icons, FONTS, URL } from '../../constants';
import { fetch_timeout, formatMoney } from "../tools/Tools";
import { connect } from 'react-redux';

class BolsaTrabajo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loadData: false,

            token: JSON.parse(this.props.token.userToken),
        }

        this.props.navigation.setOptions({
            title: 'Bolsa de Trabajo',
            headerTitle: 'Bolsa de Trabajo',
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
            }
        });
    }

    render(){
        return(
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

            <View style={styles.contenedorTitulo}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={icons.pay} resizeMode='contain' style={{ width: 24, height: 24, tintColor: COLORS.black }} />
                    <Text style={{ ...FONTS.h3, marginLeft: 5 }}>
                        Lista
                    </Text>
                </View>
            </View>

            {
                this.state.loadData ?
                    <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
                        <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                            <View style={{ padding: 10, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>Cargando información...</Text>
                            </View>
                        </View>
                    </View>
                    : null
            }

            <View style={styles.container}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10, }}>


                        </View>
                    </ScrollView>
                </View>
            </View >

        </SafeAreaView >
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contenedorTitulo: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#C1BFBF',
    },
    textMessageData: {
        ...FONTS.h4, color: COLORS.white, textAlign: 'center'
    },
});

const mapStateToProps = (state) => {
    return {
        token: state.personaReducer
    }
}


export default connect(mapStateToProps)(BolsaTrabajo);