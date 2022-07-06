import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Image,
  StatusBar
} from 'react-native';
import { images, COLORS, FONTS, SIZES } from '../constants';

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground source={images.fondo} style={css.image}>
        <StatusBar translucent backgroundColor='transparent' />
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'transparent',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={images.logoCIP}
              style={{ width: 140, height: 140 }}
            />
          </View>
          <View>
            <Text style={{ ...FONTS.text_splash }}>C.I.P. JUNIN</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
