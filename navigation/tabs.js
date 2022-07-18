import React from 'react';
import { Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, icons } from '../constants';
import { Home, Perfil, Contactenos, Consultar, Servicios } from '../screens';

const Tab = createBottomTabNavigator();

class Tabs extends React.Component {

    constructor(props) {
        super(props);
        // this.props.navigation.setOptions({
        //     title: 'CIP CD JUNÍN',
        //     headerStyle: {
        //         backgroundColor: COLORS.primary,
        //     },
        //     headerTintColor: COLORS.white,
        //     headerTitleAlign: 'center',
        //     headerTitleStyle: {
        //         ...FONTS.h3,
        //         fontWeight: 'bold',
        //         textAlignVertical: 'center',
        //         flex: 1,
        //     },
        //     headerLeft: () => (
        //         <View style={{ paddingHorizontal: 20 }}>
        //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        //                 <Image source={icons.cip} resizeMode='contain' style={{ width: 24, height: 24 }} />
        //             </View>
        //         </View>
        //     ),
        //     headerRight: () => (
        //         <View style={{ paddingHorizontal: 20 }}>
        //             <TouchableOpacity
        //                 onPress={() => this.onEventCloseSession()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        //                 <Image source={icons.turnoff} resizeMode='contain' style={{ width: 24, height: 24, tintColor: COLORS.white }} />
        //             </TouchableOpacity>
        //         </View>
        //     )
        // });
    }

    componentDidMount() {

    }

    render() {
        return (
            <Tab.Navigator tabBarOptions={{
                showLabel: false
            }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        const tintColor = focused ? COLORS.primary : COLORS.gray;
                        switch (route.name) {
                            case "Home": return (
                                <Image
                                    source={icons.home}
                                    resizeMode='contain'
                                    style={{
                                        tintColor: tintColor,
                                        width: 24,
                                        height: 24
                                    }} />
                            );
                            case "Consultar": return (<Image
                                source={icons.comprobantes}
                                resizeMode='contain'
                                style={{
                                    tintColor: tintColor,
                                    width: 24,
                                    height: 24
                                }} />);
                            case "Servicios": return (<View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 25,
                                    backgroundColor: COLORS.primary,
                                }}>
                                <Image
                                    source={icons.pagos}
                                    resizeMode="contain"
                                    style={{
                                        tintColor: COLORS.white,
                                        width: 24,
                                        height: 24,
                                    }}
                                />
                            </View>);
                            case "Contactenos": return (<Image
                                source={icons.contactanos}
                                resizeMode='contain'
                                style={{
                                    tintColor: tintColor,
                                    width: 24,
                                    height: 24
                                }} />);
                            case "Perfil": return (<Image
                                source={icons.user}
                                resizeMode='contain'
                                style={{
                                    tintColor: tintColor,
                                    width: 24,
                                    height: 24,
                                }} />);
                        }
                    }
                })}>
                <Tab.Screen
                    name="Home"
                    component={Home}>
                </Tab.Screen>
                <Tab.Screen
                    name="Consultar"
                    component={Consultar}>
                </Tab.Screen>
                <Tab.Screen
                    name="Servicios"
                    component={Servicios}>
                </Tab.Screen>
                <Tab.Screen
                    name="Contactenos"
                    component={Contactenos}>
                </Tab.Screen>
                <Tab.Screen
                    name="Perfil"
                    component={Perfil}>
                </Tab.Screen>
            </Tab.Navigator>
        );
    }
}



export default Tabs;