import {
    createStackNavigator,
    createBottomTabNavigator, NavigationEvents
} from "react-navigation";
import React, { Component, Fragment } from "react";
import {Platform, StyleSheet, Text, View, Linking, Button, TouchableWithoutFeedback, FlatList, Alert, TouchableOpacity, TouchableHighlight, Dimensions, ScrollView} from 'react-native';
import { Container, Content, Header, Title, Body, Right } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import axios from "axios";
import Video from 'react-native-video';

export default class VideoPage extends Component {  
    constructor(props) {
        super();
        const { data } = props;
        console.log("constructed value here isss thereeeeeee <<<<<<<<<<<>>>>>>>>>>>>> //////////// (((()))))))");
        console.log(data);
        console.log("final 123 valye here ussiiiiiii");
        console.log("data.post media is ==", data.post_media);
        console.log("=============== // =", data.post_media[0]);
        console.log("http://70.51.251.63:3000/" + data.post_media[0]);
        this.state = {
            'paused': false,
            'videoUrl': "http://70.51.251.63:3000/" + data.post_media[0],
            onBlur: false
        }
    }
   
    componentWillMount() {

    }

    _onBlurVideo() {
        console.log("inside on blur video value hereee <<<<<<<<<>>>>>>>>>>>>>?///////////", this.state.paused);
        this.setState({paused: !this.state.paused, onBlur: this.state.onBlur});
        console.log("after set value here ==", this.state.paused);
    }
    render() {
        console.log("inside post video render render value here here");
        return (   
            <View> 
                <NavigationEvents
                    //onWillFocus={payload => console.log('will focus 44444444444444444444444444444444',payload)}
                    onDidFocus={() => this._onBlurVideo()}
                    /* onWillBlur={() => {
                            console.log("inside willll blur vake herre ==", this.state.paused);
                            this.setState({paused: true})
                            console.log("33333 ..", this.state.paused);
                        }
                    } */
                    onDidBlur={() => this._onBlurVideo()}
                />         
                <Video source={{uri: this.state.videoUrl}}
                    ref={(ref) => {
                        this.player = ref
                    }} 
                    resizeMode="cover" 
                    paused={this.state.paused}
                   // repeat={true}
                    muted={false}
                    //onEnd={() => {this.player.seek(0)}}
                    style={[StyleSheet.absoluteFill, {top: 10, height: 280}]}
                /> 
            </View>
        );
    }
}    