import React, {Component} from 'react';
import {
    AsyncStorage,
    FlatList,
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {colors} from '../utils/Colors';
import {EventListData} from '../utils/EventListData';
import {Card} from 'native-base';
import GestureRecognizer from 'react-native-swipe-gestures';
import {config} from '../utils/Constants';

let trackingData;
export default class EventsList extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Event List',
            headerTintColor: colors.WHITE,
            headerStyle: {
                backgroundColor: colors.BLUE,
            },
        };
    };
    _renderType = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }}
            >
                <Card
                    style={{
                        flexDirection: 'row',
                        borderRadius: 25,
                        justifyContent: 'space-between',
                    }}
                >
                    <TouchableOpacity
                        style={this.state.type === true ? styles.viewSelectedStyle : styles.viewNotSelectedStyle}
                        onPress={() => {
                            setTimeout(() => this.setState({type: true}), 0);
                        }}
                    >
                        <Text
                            style={{
                                color: this.state.type === true ? colors.WHITE : colors.BLACK,
                                fontWeight: 'bold',
                            }}
                        >
                            ListView
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={this.state.type === false ? styles.viewSelectedStyle : styles.viewNotSelectedStyle}
                        onPress={() => {
                            setTimeout(() => this.setState({type: false}), 0);
                        }}
                    >
                        <Text
                            style={{
                                color: this.state.type === false ? colors.WHITE : colors.BLACK,
                                fontWeight: 'bold',
                            }}
                        >
                            GridView
                        </Text>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    };

    _keyExtractor = (item) => item.id;

    renderListView = (items) => {
        console.log('inside  List ' + JSON.stringify(items));
        return (<FlatList
            data={items}
            contentContainerStyle={{paddingBottom: 80}}
            keyExtractor={this._keyExtractor}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('EventDetails', {item: item})}
                                  style={styles.listItemContainer}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={[styles.listItemContainer]}>
                            <Image
                                source={{uri: item.imageUrl}}
                                style={styles.listImage}
                                onError={() => {

                                }}
                                defaultSource={require('../assets/no_internet.png')}
                            />
                            <View style={{flex: 1, flexDirection: 'column', padding: 12, alignSelf: 'center'}}>
                                {this.renderCustomTextInputLayout('Event Name', item.name)}
                                {this.renderCustomTextInputLayout('Location', item.place)}
                                {this.renderCustomTextInputLayout('Entry Type', item.freeEntry === 1 ? 'Free Entry' : 'Paid Entry')}
                            </View>
                        </View>
                        <View style={{height: 1, backgroundColor: colors.GRAY}}>

                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />);
    };
    renderGridView = (items) => {
        return (<FlatGrid
            items={items}
            keyExtractor={this._keyExtractor}
            contentContainerStyle={{paddingBottom: 80}}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EventDetails', {item: item})}
                                      style={styles.itemContainer}>
                        <ImageBackground style={styles.itemContainer} source={{uri: item.imageUrl}}>
                            <Text style={styles.gridItemName}>{item.name}</Text>
                        </ImageBackground>
                    </TouchableOpacity>);
            }}
        />);
    };

    constructor(props) {
        super(props);
        this.state = {
            type: true
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
        const items = EventListData;
        return (
            <SafeAreaView>
                <GestureRecognizer
                    onSwipeLeft={()=>{
                        this.getUserDataIfExist()
                    }}
                    config={config}
                >
                    {this._renderType()}
                    {this.state.type === true ? this.renderListView(items) : this.renderGridView(items)}
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
