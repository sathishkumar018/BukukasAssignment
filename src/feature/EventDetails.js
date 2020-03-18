import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../utils/Colors';
import {config} from '../utils/Constants';
import GestureRecognizer from 'react-native-swipe-gestures';

let trackingData;
export default class EventDetails extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Event Details',
            headerTintColor: colors.WHITE,
            headerStyle: {
                backgroundColor: colors.BLUE,
            },
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            item: {},
            from: false,
        };
    }

    componentDidMount() {
        let item = this.props.navigation.getParam('item', {});
        let from = this.props.navigation.getParam('from', false);
        this.setState({item, from});
    }

    render() {
        const {item} = this.state;
        return (
            <SafeAreaView style={{flex: 1, flexDirection: 'column', margin: 5}}>
                <GestureRecognizer
                    onSwipeLeft={() => {
                        this.getUserDataIfExist();
                    }}
                    config={config}
                    style={{flex: 1, flexDirection: 'column'}}
                >
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Image
                            source={{uri: item.imageUrl}}
                            style={styles.listImage}
                        />
                        <View style={{flex: 1, flexDirection: 'column', margin: 5, padding: 5}}>
                            {this.renderCustomTextInputLayout('Event Name', item.name)}
                            {this.renderCustomTextInputLayout('Location', item.place)}
                            {this.renderCustomTextInputLayout('Entry Type', item.freeEntry === 1 ? 'Free Entry' : 'Paid Entry')}
                            {!this.state.from && <TouchableOpacity
                                onPress={() => {
                                    // add it to the local storage
                                    this.updateStorage(item);
                                }}
                                style={styles.button}>
                                <Text style={styles.buttonText}>Add To Tracking</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </GestureRecognizer>
            </SafeAreaView>
        );
    }

    getUserDataIfExist() {
        let userName = global.userName;
        AsyncStorage.getItem(userName).then((data) => {
            trackingData=data;
            if(trackingData && trackingData!=="[]"){
                this.props.navigation.navigate('EventTracking', {
                    data: JSON.parse(trackingData)
                });
            }else{
                alert("You don't have any events in tracking list");
            }
        });
    }

    updateStorage(selectedItem) {
        let userName = global.userName;
        AsyncStorage.getItem(userName).then((stringData) => {
            try {
                let data = JSON.parse(stringData);
                console.warn('here data' + JSON.stringify(data));
                if (data && data.length > 0) {
                    let isDataExist = data.find(function (item) {
                        return item.id === selectedItem.id;
                    });
                    console.warn('isData' + JSON.stringify(isDataExist));
                    if (!!isDataExist) {
                        this.props.navigation.goBack();
                        this.showMessage('Event already exist in tracking list.');
                    } else {
                        data.push(selectedItem);
                        AsyncStorage.setItem(userName, JSON.stringify(data));
                        this.showMessage();
                    }
                } else {
                    this.insertThisAsFresh(selectedItem);
                }
            } catch (e) {
                this.insertThisAsFresh(selectedItem);
            }
        }).catch((err) => {
            if (err) {
                this.insertThisAsFresh(selectedItem);
            }
        });
    }

    insertThisAsFresh(selectedItem) {
        let data = [];
        data.push(selectedItem);
        AsyncStorage.setItem(userName, JSON.stringify(data));
        this.showMessage();
    }

    showMessage(msg) {
        Alert.alert(
            'Event Added',
            msg ? msg : 'Event added successfully to your tracking list.',
            [
                {
                    text: 'OK', onPress: () => {
                        console.log('OK Pressed');
                        this.props.navigation.goBack();
                    },
                },
            ],
        );
    }


    renderCustomTextInputLayout(title, value) {
        return (
            <View style={{flex: 1, flexDirection: 'column', margin: 8}}>
                <Text style={styles.itemNameLabel}>{title}</Text>
                <Text style={styles.itemName}>{value}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    listImage: {
        flex: 1,
        height: 140,
        width: '100%',
        padding: 10,
        alignSelf: 'center',
    },
    itemNameLabel: {
        fontSize: 14,
        color: '#bd7fc3',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.BLACK,
    },
    button: {
        backgroundColor: colors.BLUE_BRIGHT,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 10,
        padding: 6,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        alignSelf: 'center',
        color: colors.WHITE,
    },
});
