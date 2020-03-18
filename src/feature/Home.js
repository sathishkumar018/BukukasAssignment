/**
 * Created by @Soumya Ranjan Sethy <soumya.sethy@routematic.com>
 * */
import React, {Component} from 'react';
import {
    AsyncStorage,
    ImageBackground,
    Keyboard,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {Button, Container, Input, Item, Text} from 'native-base';
import {colors} from '../utils/Colors';
import {loginString} from '../utils/Constants';
//Validation for Email/Password
let emailSchema = require('email-validator');

//create a component
class Home extends Component {
    static navigationOptions = {
        title: 'Welcome',
        headerLeft: null,
        headerStyle: {display: 'none'},
    };
    onUpdate = () => {
        this.setState({
            isLoading: false,
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            isLoading: false,
        };
        global.userName = '';
    }

    componentWillUnmount() {
        if (this.state.isLoading) {
            this.onUpdate();
        }
    }


    getUserDataIfExist(userName) {
        if (!userName) {
            alert(loginString.userNameBlank);
        } else {
            global.userName = userName;
            AsyncStorage.getItem(userName).then((data) => {
                console.warn('outer ' + data.length);
                if (data && data !== '[]') {
                    this.props.navigation.navigate('EventTracking', {
                        data: JSON.parse(data),
                    });
                } else {
                    this.props.navigation.navigate('EventList');
                }
            }).catch((err) => {
                if (err) {
                    this.props.navigation.navigate('EventList');
                }
            });
        }
    }

    //Handle Text Change Event
    userNameChangeHandler(text) {
        this.setState({
            username: text,
        });
    }

    render() {
        const {username} = this.state;

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
                onPressIn={() => {
                    Keyboard.dismiss();
                }}
                onPressOut={() => {
                    Keyboard.dismiss();
                }}
            >
                <Container>
                    <View style={{flex: 1}}>
                        <StatusBar barStyle="light-content"/>

                        <ImageBackground
                            source={require('../assets/cp_background.jpg')}
                            defaultSource={require('../assets/cp_background.jpg')}
                            resizeMethod="scale"
                            resizeMode="cover"
                            style={styles.imageBackground}
                        >
                            <View style={styles.loginScreen}>
                                <View style={styles.windowLayer}>
                                    <Text style={styles.loginTxtUp}>Welcome to Bukukas</Text>
                                    <Item style={styles.inputText}>
                                        <Input
                                            style={styles.input}
                                            placeholder={loginString.enterEmail}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            multiline={false}
                                            autoCorrect={false}
                                            numberOfLines={1}
                                            keyboardType="email-address"
                                            returnKeyType="next"
                                            onChangeText={text => this.userNameChangeHandler(text)}
                                            value={username}
                                            blurOnSubmit={true}
                                        />
                                    </Item>
                                    <Button
                                        block
                                        full
                                        style={styles.button}
                                        onPress={() => {
                                            this.getUserDataIfExist(username);
                                        }}
                                    >
                                        <Text>Sign in</Text>
                                    </Button>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </Container>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    loginScreen: {
        flex: 1,
        backgroundColor: 'transparent', //colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    top: {
        width: '80%',
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    windowLayer: {
        width: '90%',
        height: '70%',
        padding: '3%',
        marginBottom: '5%',
        borderRadius: 10,
        shadowColor: colors.GRAY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: 5,
        shadowOpacity: 0.2,
    },
    imageBackground: {
        justifyContent: 'center',
        alignContent: 'flex-start',
        flex: 1,
        width: '100%',
        height: '100%',
    },
    input: {
        color: colors.WHITE,
        width: '100%',
        height: 40,
    },
    loginTxtUp: {
        width: '100%',
        marginTop: '10%',
        //fontFamily: 'Helvetica',
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.WHITE,
        textAlign: 'center',
    },
    button: {
        borderRadius: 5,
    },
    inputText: {
        height: '15%',
        marginBottom: 6,
    },
});
export default Home;
