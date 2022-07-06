import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes,
  Image
} from "react-native";
import CheckBox from '@react-native-community/checkbox';

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 5
  },
  input: {
    height: 40,
  },
});

const CVC_INPUT_WIDTH = 100;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get("window").width - EXPIRY_INPUT_WIDTH - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  constructor(props) {
    super(props);
  }

  _inputProps = field => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      iconLeftButton,
      iconRightButton,
      onEventLeft,
      onEventRight,
      guardarTarjeta,
      onGuardarTarjeta,
      isVisibleNumber,
      isVisibleExpiry,
      isVisibleCvc,
      isVisibleName,
      isCompletePay,
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type },
      focused,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} />
        <ScrollView ref="Form"
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={s.form}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {
              !isVisibleNumber ?
                <TouchableOpacity onPress={onEventLeft}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      backgroundColor: "#F8F8F8"
                    }}>
                    <Image
                      source={iconLeftButton}
                      style={{
                        width: 18,
                        height: 18,
                        marginHorizontal: 10,
                        tintColor: '#020203',
                        resizeMode: 'stretch',
                      }}
                    />
                  </View>
                </TouchableOpacity>
                :
                <View>
                  <Image
                    source={iconLeftButton}
                    style={{
                      width: 18,
                      height: 18,
                      opacity: 0,
                      marginHorizontal: 10,
                      tintColor: 'white',
                      resizeMode: 'stretch',
                    }}
                  />
                </View>
            }

            {!isCompletePay ?
              (
                isVisibleNumber ?
                  <CCInput
                    {...this._inputProps("number")}
                    keyboardType="numeric"
                    containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />
                  :
                  isVisibleExpiry ?
                    <CCInput {...this._inputProps("expiry")}
                      keyboardType="numeric"
                      containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />
                    :
                    isVisibleCvc ?
                      (requiresCVC &&
                        <CCInput {...this._inputProps("cvc")}
                          keyboardType="numeric"
                          containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />)
                      :
                      (requiresName &&
                        <CCInput {...this._inputProps("name")}
                          containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />)
              )
              :
              <View style={{ width: CARD_NUMBER_INPUT_WIDTH, alignItems: 'center' }}>
                <CheckBox
                  value={guardarTarjeta}
                  onValueChange={(value) => onGuardarTarjeta(value)}
                />
                <Text style={this.props.labelStyle}>
                  Guardar Tarjeta
                </Text>
              </View>
            }

            {
              isVisibleNumber && !isCompletePay ||
                isVisibleExpiry && !isCompletePay ||
                isVisibleCvc && !isCompletePay ||
                requiresName && !isCompletePay
                ?
                <TouchableOpacity onPress={onEventRight}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      backgroundColor: "#F8F8F8"
                    }}>
                    <Image
                      source={iconRightButton}
                      style={{
                        width: 18,
                        height: 18,
                        marginHorizontal: 10,
                        tintColor: '#020203',
                        resizeMode: 'stretch',
                      }} />
                  </View>
                </TouchableOpacity>
                :
                <View>
                  <Image
                    source={iconRightButton}
                    style={{
                      width: 18,
                      height: 18,
                      opacity: 0,
                      marginHorizontal: 10,
                      tintColor: 'white',
                      resizeMode: 'stretch',
                    }} />
                </View>
            }
          </View>
          {/*           
          {requiresPostalCode &&
            <CCInput {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />} */}
        </ScrollView>
      </View>
    );
  }
}
