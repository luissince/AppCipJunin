import React, { useEffect } from 'react';
import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RemotePushController = () => {

  LocalNotification = (title, body, subTitle) => {

    PushNotification.localNotification({
      id: '123',
      // autoCancel: true,
      title: title,
      bigText: body,
      subText: subTitle,
      message: 'Expandir para ver mas.',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      // actions: '["Yes", "No"]',
      channelId: 1
    });
  };

  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (token) {
        let fcmtoken = await AsyncStorage.getItem('tokenfcm');
        if (!fcmtoken) {
          await AsyncStorage.setItem('tokenfcm', token.token);
        }
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: async function (notification) {        
        if (notification.data != undefined) {    
      
          if (notification.data.body) {
      
            let userToken = await AsyncStorage.getItem('user');
      
            if (userToken != null) {
              LocalNotification(notification.data.title, notification.data.body, notification.data.subtitle);
            }
          }
        }

        if (notification.actions != undefined) {
          PushNotification.cancelLocalNotification('123');
        }
      },

      // Android only: GCM or FCM Sender ID
      senderID: '302234010340',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return null;
};

export default RemotePushController;