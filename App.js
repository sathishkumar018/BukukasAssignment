import React from "react";
import AuthLoadingScreen from "./src/auth/AuthLoadingScreen";
import {View, YellowBox } from "react-native";
import NavigationService from "./src/utils/NavigationService";

export default class App extends React.Component {

    render() {
        return (
            <View style={{ flex: 1 }}>
                <AuthLoadingScreen
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </View>
        );
    }
}

YellowBox.ignoreWarnings(["Class RCTCxxModule"]);
YellowBox.ignoreWarnings(["Setting a timer"]);
YellowBox.ignoreWarnings(["Deprecation warning"]);
YellowBox.ignoreWarnings([
    "Warning: isMounted(...) is deprecated",
    "Module RCTImageLoader"
]);
