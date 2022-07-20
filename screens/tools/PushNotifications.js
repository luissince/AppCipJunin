import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from "react-native-push-notification";

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus)
    }
}

export async function GetFCMToken() {
    let fcmtoken = await AsyncStorage.getItem('tokenfcm');
    console.log(fcmtoken);
    if (!fcmtoken) {
        try {
            const fcmtoken = await messaging().getToken();
            if (fcmtoken) {
                console.log('new token:', fcmtoken);
                await AsyncStorage.setItem('tokenfcm', fcmtoken);
            }
        } catch (error) {
            console.log(error, 'error in fcmtoken')
        }
    }
}

export async function NotificationListener() {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
    });

    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Notification caused to open from quit state:', remoteMessage.notification);
        }
    });

    messaging().onMessage(async remoteMessage => {
        console.log('notification on froground state....', remoteMessage);
    });
}


export function showNotification() {
    PushNotification.localNotification({
        autoCancel: true,
        bigText:
          'This is local notification demo in React Native app. Only shown, when expanded.',
        subText: 'Local Notification Demo',
        title: 'Local Notification Title',
        message: 'Expand me to see more',
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        actions: '["Yes", "No"]'
    });
}

export function handleScheduleNotification(){
    PushNotification.localNotificationSchedule({
        title: 'Title', 
        message: "My Notification Message", // (required)
        date: new Date(Date.now() + 5 * 1000), // in 5 secs
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      
        /* Android Only Properties */
        repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      });
}

export function handleCancel(){
    PushNotification.cancelAllLocalNotifications();
}