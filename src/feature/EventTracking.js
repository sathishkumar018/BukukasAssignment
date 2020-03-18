import React, {Component} from 'react';
import {AsyncStorage, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../utils/Colors';
import GestureRecognizer from 'react-native-swipe-gestures';
import {config} from '../utils/Constants';

export default class EventsTracking extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Tracking List',
            headerTintColor: colors.WHITE,
            headerStyle: {
                backgroundColor: colors.BLUE,
            },
        };
    };

    _keyExtractor = (item) => item.id;

    renderListView = (items) => {
        console.log('inside  List ' + JSON.stringify(items));
        return (<FlatList
            data={items}
            contentContainerStyle={{paddingBottom: 80}}
            keyExtractor={this._keyExtractor}
            renderItem={({item, index}) => (
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('EventDetails', {item: item, from: true})}
                    style={styles.listItemContainer}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={[styles.listItemContainer]}>
                            <Image
                                source={{uri: item.imageUrl}}
                                style={styles.listImage}
                            />
                            <View style={{flex: 1, flexDirection: 'column', padding: 12, alignSelf: 'center'}}>
                                {this.renderCustomTextInputLayout('Event Name', item.name)}
                                {this.renderCustomTextInputLayout('Location', item.place)}
                                {this.renderCustomTextInputLayout('Entry Type', item.freeEntry === 1 ? 'Free Entry' : 'Paid Entry')}
                            </View>
                            <View style={{
                                width: 30,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                margin: 4,
                            }}>
                                {index > 0 && <TouchableOpacity
                                    onPress={() => {
                                        let array = this.state.data;
                                        let position = (index - 1);
                                        let previous = array[position];
                                        array.splice(position, 1, item);
                                        array.splice(index, 1, previous);
                                        this.setState({data: array});
                                        let userName = global.userName;
                                        AsyncStorage.setItem(userName, JSON.stringify(array));
                                    }}>
                                    <Image
                                        style={{width: 32, height: 32, padding: 4}}
                                        source={require('../assets/top_arrow.png')}
                                    />
                                </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={() => {
                                    let filteredData = this.state.data.filter(Item => Item.id !== item.id);
                                    this.setState({data: filteredData});
                                    let userName = global.userName;
                                    AsyncStorage.setItem(userName, JSON.stringify(filteredData));
                                }}>
                                    <Image
                                        style={{width: 32, height: 32, padding: 4}}
                                        source={require('../assets/delete.png')}
                                    />
                                </TouchableOpacity>
                                {index < (items.length - 1) &&
                                <TouchableOpacity
                                    onPress={() => {
                                        let array = this.state.data;
                                        let position = (index + 1);
                                        let next = array[position];
                                        array.splice(position, 1, item);
                                        array.splice(index, 1, next);
                                        this.setState({data: array});
                                        let userName = global.userName;
                                        AsyncStorage.setItem(userName, JSON.stringify(array));
                                    }}>
                                    <Image
                                        style={{width: 32, height: 32, padding: 4}}
                                        source={require('../assets/bottom_arrow.png')}
                                    />
                                </TouchableOpacity>
                                }

                            </View>
                        </View>
                        <View style={{height: 1, backgroundColor: colors.GRAY}}>

                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />);
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    renderCustomTextInputLayout(title, value) {
        return (
            <View style={{flex: 1, flexDirection: 'column', margin: 5}}>
                <Text style={styles.itemNameLabel}>{title}</Text>
                <Text style={styles.itemName} numberOfLines={1}>{value}</Text>
            </View>
        );
    }

    render() {
        const {data} = this.state;
        return (<SafeAreaView>
                <GestureRecognizer
                    onSwipeRight={() => {
                        this.props.navigation.goBack();
                    }}
                    config={config}
                >
                    {this.renderListView(data)}
                </GestureRecognizer>
            </SafeAreaView>
        );
    }

    componentDidMount() {
        let data = this.props.navigation.getParam('data', {});
        this.setState({data});
    }
}
const styles = StyleSheet.create({
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        borderRadius: 5,
        padding: 5,
        height: 150,
        backgroundColor: colors.WHITE,
    },
    listItemContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 5,
        height: 150,
        flexDirection: 'row',
        backgroundColor: colors.WHITE,
    },
    listImage: {
        height: 130,
        width: 150,
        alignSelf: 'center',
    },
    itemNameLabel: {
        fontSize: 12,
        color: '#bd7fc3',
    },
    itemName: {
        fontSize: 14,
        color: colors.BLACK,
    },
    gridItemName: {
        fontSize: 14,
        color: colors.WHITE,
        fontWeight: '600',
        marginLeft: 4,
        position: 'absolute',
        bottom: 0,
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    viewSelectedStyle: {
        borderRadius: 30,
        width: 100,
        padding: 5,
        backgroundColor: colors.BLUE_BRIGHT,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    viewNotSelectedStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,

    },
});
