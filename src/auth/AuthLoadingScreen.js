import React from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { createAppContainer, createStackNavigator, createSwitchNavigator } from "react-navigation";
import {colors} from "../utils/Colors.js";
import {asyncString} from '../utils/Constants';
import Home from '../feature/Home';
import EventList from '../feature/EventsList'
import EventTracking from '../feature/EventTracking'
import EventDetails from '../feature/EventDetails'


class AuthLoadingScreen extends React.Component {
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem(asyncString.isUserLoggedIn);
        this.props.navigation.navigate(userToken ? "App" : "Auth");
    };

    constructor() {
        super();
         this._bootstrapAsync();
    }

    render() {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignContent: "flex-start",
                    flex: 1,
                    backgroundColor: colors.BACKGROUND
                }}
            >
                <View style={styles.container}>
                    <ActivityIndicator size={"large"} color={colors.BLACK}/>
                    <Text style={styles.text}>Please wait...</Text>
                    <StatusBar barStyle="default"/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        height: "70%",
        width: "60%",
        resizeMode: "contain",
        alignItems: "center",
        justifyContent: "center"
    }
});
const AppStack = createStackNavigator({
    EventList: EventList,
    EventTracking: EventTracking,
    EventDetails:EventDetails
});

const AuthStack = createStackNavigator({
    Home: Home
});

export default createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack
        },
        {
            initialRouteName: "AuthLoading"
        }
    )
);
