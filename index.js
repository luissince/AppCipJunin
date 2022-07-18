import React from 'react';
import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import configureStore from './screens/store';

const store = configureStore();

const onDisplayNotification = async (remoteMessage) => {
    // Create a channel
    const channelId = await notifee.createChannel({
        id: 'import',
        name: 'Import channels',
    });

    // Display a notification
    await notifee.displayNotification({
        title: remoteMessage.data.title,
        subtitle: remoteMessage.data.subtitle,
        body: remoteMessage.data.body,
        android: {
            channelId: channelId,
            actions: [
                {
                    title: '<b>Ver</b> &#128065;&#65039;',
                    pressAction: {
                        id: 'open',
                        mainComponent: "App",
                    },
                },
            ]
        },
    });
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    if (type === EventType.ACTION_PRESS && pressAction == "open") {
        await notifee.cancelNotification(notification.id);
    }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    try {
        let userToken = await AsyncStorage.getItem('user');
        if (userToken != null) {
            onDisplayNotification(remoteMessage);
        }
    } catch (error) {

    }
});

const ReduxComponent = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxComponent);
