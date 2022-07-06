import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import { fetch_timeout } from './tools/Tools';
import { COLORS, SIZES, icons, FONTS, URL } from '../constants';
import { connect } from 'react-redux';

class CertHabilidad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      message: "",
      stateresponse: false,
      refreshing: true,
      generate: false,
      token: JSON.parse(this.props.token.userToken)
    }

    this.props.navigation.setOptions({
      title: 'Cert. Habilidad',
      headerTitle: 'Cert. Habilidad',
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

  componentDidMount() {
    this.loadCuentas();
  }

  loadCuentas() {
    this.setState({ message: 'Cargando certificado...', refreshing: true });
    fetch_timeout(URL.CERT_HABILIDAD_PERSONA, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "idDni": this.state.token.idDNI,
      })
    }, 10000).then(result => {
      if (result.state == 0) {
        this.setState({
          message: result.message,
          data: [],
          stateresponse: false,
          refreshing: false
        });
      } else {
        if (result.state == 1) {
          this.setState({
            data: result.data,
            stateresponse: true,
            refreshing: false
          });
        } else {
          this.setState({
            message: result.message,
            data: [],
            stateresponse: false,
            refreshing: false
          });
        }
      }
    });
  }

  async sendToShare(item) {
    let fileName = "Certificado De Habilidad  N°-" + item.Numero;
    let filePath = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir;
    let path = filePath + "/" + fileName + ".pdf";
    let fileUrl = URL.DOMINIO + 'sunat/pdfCertHabilidadView.php?idIngreso=' + item.idIngreso;
    let config = Platform.OS === 'ios' ? {
      fileCache: true,
      path: path,
      appendExt: "pdf",
      notification: false,
    } : {
      fileCache: true,
      appendExt: "pdf",
      addAndroidDownloads: {
        useDownloadManager: true,
        mime: "application/pdf",
        notification: false,
        mediaScannable: true,
        title: fileName + ".pdf",
        path: path,
      }
    };

    if (Platform.OS === 'ios') {
      this.setState({ generate: true });
      try {
        let exist = await RNFetchBlob.fs.exists(path);
        if (exist) {
          await RNFetchBlob.fs.unlink(path);
        }

        let download = await RNFetchBlob.config(config).fetch('GET', fileUrl);
        let base64 = await RNFetchBlob.fs.readFile(download.path(), 'base64');
        let base64Data = 'data:application/pdf;base64,' + base64;
        try {
          this.setState({ generate: false });
          await Share.open({
            title: "Compartir",
            url: base64Data,
            message: "Comprobante de Pago",
            filename: fileName
          });
          let exist = await RNFetchBlob.fs.exists(download.path());
          if (exist) {
            await RNFetchBlob.fs.unlink(download.path());
          }
        } catch (error) {
          this.setState({ generate: false });
        }
      } catch (error) {
        this.setState({ generate: false });
      } finally {
        this.setState({ generate: false });
      }
    } else {
      this.setState({ generate: true });
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          try {
            let exist = await RNFetchBlob.fs.exists(path);
            if (exist) {
              await RNFetchBlob.fs.unlink(path);
            }

            let download = await RNFetchBlob.config(config).fetch('GET', fileUrl);
            let base64 = await RNFetchBlob.fs.readFile(download.path(), 'base64');
            let base64Data = 'data:application/pdf;base64,' + base64;
            try {
              this.setState({ generate: false });
              await Share.open({
                title: "Compartir",
                url: base64Data,
                message: "Comprobante de Pago",
                filename: fileName
              });
              let exist = await RNFetchBlob.fs.exists(download.path());
              if (exist) {
                await RNFetchBlob.fs.unlink(download.path());
              }
            } catch (error) {
              this.setState({ generate: false });
            } finally {
              this.setState({ generate: false });
            }
          } catch (error) {
            this.setState({ generate: false });
          }
        } else {
          Alert.alert('Permiso Denegado!', 'Debe otorgar permiso de almacenamiento para descargar el archivo.');
        }
      } catch (err) {
        Alert.alert('Problema!', 'Se genero un problema: ' + err.message);
      } finally {
        this.setState({ generate: false });
      }
    }
  }

  async dowloadPdf(item) {
    let fileName = "Certificado De Habilidad  N°-" + item.Numero;
    let filePath = Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir;
    let path = filePath + "/" + fileName + ".pdf";
    let fileUrl = URL.DOMINIO + 'sunat/pdfCertHabilidadView.php?idIngreso=' + item.idIngreso;
    let config = Platform.OS === 'ios' ? {
      fileCache: true,
      path: path,
      appendExt: "pdf",
      notification: true,
    } : {
      fileCache: true,
      appendExt: "pdf",
      addAndroidDownloads: {
        useDownloadManager: true,
        mime: "application/pdf",
        notification: true,
        mediaScannable: true,
        title: fileName + ".pdf",
        path: path,
      }
    };

    if (Platform.OS === 'ios') {
      Alert.alert('Información', "Iniciando descarga.")
      this.downloadFile(config, path, fileUrl);
    } else {
      Alert.alert('Información', "Iniciando descarga.")
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.downloadFile(config, path, fileUrl);
        } else {
          Alert.alert('Permiso Denegado!', 'Debe otorgar permiso de almacenamiento para descargar el archivo.');
        }
      } catch (err) {
        Alert.alert('Problema!', 'Se genero un problema: ' + err.message);
      }
    }
  }

  async downloadFile(config, path, fileUrl) {
    try {
      let exist = await RNFetchBlob.fs.exists(path);
      if (exist) {
        await RNFetchBlob.fs.unlink(path);
      }
      try {
        let download = await RNFetchBlob.config(config).fetch('GET', fileUrl);
        await FileViewer.open(download.path());
      } catch (error) {
      }
      // await FileViewer.open(filePath + "/" + fileName + ".pdf");
    } catch (error) {
    }
  }



  render() {
    return (
      <SafeAreaView style={styles.safeAreaView} >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbar} />

        <View style={styles.contenedorTitulo}>
          <View style={{ marginRight: 10 }}>
            <Image
              source={icons.certHabilidad}
              resizeMode='contain'
              style={styles.itemIcon} />
          </View>
          <View>
            <Text style={{ fontWeight: 'bold' }}>
              Lista de Certificados de Habilidad
            </Text>
          </View>
        </View>

        {
          this.state.generate ?
            <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', left: 0, top: 0, zIndex: 20 }}>
              <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
                <View style={{ padding: 10, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={{ ...FONTS.h3, color: COLORS.secondary, textAlign: 'center' }}>Generando vista para compartir...</Text>
                </View>
              </View>
            </View>
            : null
        }

        <View style={{ flex: 1 }}>
          {
            this.state.refreshing ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center' }}>{this.state.message}</Text>
              </View>
              :
              this.state.stateresponse ?
                this.state.data.length == 0 ?
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
                    <Image
                      source={icons.information}
                      resizeMode='contain'
                      style={{ width: 38, height: 38 }} />
                    <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center' }}>No hay comprobantes asociados a tu cuenta para mostrar.</Text>
                  </View>
                  :
                  <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                      <View style={styles.box}>

                        <View style={styles.cabecera}>
                          <Text style={{ ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' }}>
                            N°- de Certificado
                          </Text>
                          <Text style={{ ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' }}>
                            {item.Numero}
                          </Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ width: '70%' }}>
                            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                              <Text style={{ ...FONTS.p, fontWeight: 'normal' }}>Fecha Creación: {item.Fecha}</Text>
                            </View>

                            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                              <Text style={{ ...FONTS.h5 }}>Vigencia Hasta: {item.HastaFecha}</Text>
                            </View>
                          </View>

                          <View style={{ width: '30%', justifyContent: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.dowloadPdf(item)} style={styles.exportPdf}>
                              <Image
                                style={{ width: 30, height: 30, tintColor: COLORS.white }}
                                source={icons.documentPdf}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.sendToShare(item)} style={styles.exportShare}>
                              <Image
                                style={{ width: 30, height: 30, tintColor: COLORS.white }}
                                source={icons.compartir}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>)}
                    keyExtractor={item => item.idIngreso.toString()}
                  />
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
                  <Image
                    source={icons.error}
                    resizeMode='contain'
                    style={{ width: 38, height: 38 }} />
                  <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: 'center' }}>{this.state.message}</Text>
                </View>
          }
        </View>
      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.lightGray
  },
  contenedorTitulo: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  box: {
    backgroundColor: COLORS.white,
    margin: 20,
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
  cabecera: {
    width: '100%',
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  estadoDocumento: {
    backgroundColor: '#68E55D',
    borderRadius: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  exportPdf: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
  },
  exportShare: {
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
  },
  itemIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.black
  }
});

const mapStateToProps = (state) => {
  return {
    token: state.personaReducer
  }
}


export default connect(mapStateToProps)(CertHabilidad);
