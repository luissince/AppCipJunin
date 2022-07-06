import React from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import { COLORS, SIZES, icons, FONTS, images } from '../../constants';
import { formatMoney, nombreMes } from "../tools/Tools";
import CheckBox from '@react-native-community/checkbox';

export default class ChechBox extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { item, monto, selectCheck } = this.props;
        return (
            <TouchableOpacity 
                onPress={() => { selectCheck(item); }}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                        disabled={true}
                        value={true}                        
                    />
                    <Text style={{ ...FONTS.body4, color: COLORS.secondary, marginLeft: 5 }}>{nombreMes(item.mes)} - {item.year}</Text>
                </View>
                <View>
                    <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>{formatMoney(monto)}</Text>
                </View>
            </TouchableOpacity>
        );
    }

}

