import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, icons, FONTS } from '../../constants';

export default class HeaderTab extends React.Component {

    render() {
        return (
            <View style={{
                backgroundColor: COLORS.primary,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10
            }}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={icons.cip} resizeMode='contain' style={{ width: 24, height: 24 }} />
                    </View>
                </View>

                <View style={{ alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontWeight: 'bold', textAlignVertical: 'center' }}>CIP CD JUNIN</Text>
                </View>

                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                    <TouchableOpacity
                        onPress={() => this.props.onEventCloseSession()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={icons.turnoff} resizeMode='contain' style={{ width: 24, height: 24, tintColor: COLORS.white }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}