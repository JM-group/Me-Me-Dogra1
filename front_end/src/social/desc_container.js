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
import ViewMoreText from 'react-native-view-more-text';

export default class DescContainer extends Component {  
    constructor(props) {
        super();
        const { data, navigation } = props;
        console.log("constructed value here isss thereeeeeee");
        console.log(data);
        console.log("final 123 valye here ussiiiiiii");
        console.log("data.post media is ==", data.post_media);
        console.log("http://70.51.251.63:3000/" + data.post_media[0]);
        this.state = {
            paused: false,
            videoUrl: "http://70.51.251.63:3000/" + data.post_media[0],
            onBlur: false, 
            descContHeight: 250,
            description: data.description,
            navigation: navigation
        }
    }
   
    componentWillMount() {

    }

    _onBlurVideo() {
        console.log("inside on blur video value hereee <<<<<<<<<>>>>>>>>>>>>>?///////////", this.state.paused);
        //this.setState({paused: !this.state.paused, onBlur: this.state.onBlur});
        console.log("after set value here ==", this.state.paused);
    }
    render() {
        return (   
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between", height: this.state.descContHeight, top: 200
            }}>  
                <View style={{flex: 3}}>  
                    <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={this.renderViewMore.bind(this)}
                        renderViewLess={this.renderViewLess.bind(this)}
                        //textStyle={{textAlign: 'flex-end'}}
                    >  
                        <Text>{this.state.description}</Text>
                    </ViewMoreText>
                </View>  
                <View style={{flex: 1, left: 20}}> 
                    <TouchableOpacity 
                    style={{
                        borderWidth:1,
                        borderColor:'#FA3E44',
                        alignItems:'center',
                        justifyContent:'center',
                        width:60,
                        height:60,
                        backgroundColor:'#FA3E44',
                        borderRadius:50
                    }}
                    onPress={() => this.state.navigation.navigate('EditorScreen', { 'video_url': this.state.videoUrl, 'loaded': true, 'from': 'social'})}>    
                        <Icon name="microphone" size={30}></Icon>
                    </TouchableOpacity>    
                </View>   
            </View>    
        );
    }

    renderViewMore(onPress){
        console.log("inside render view more here");
        console.log(onPress);
        if (this.state.descContHeight == 400) {
            this.setState({descContHeight: 250});
        }    
        return(
          <Text style={{left: 5, color: 'red'}} onPress={onPress}>Read more</Text>
        )
    }
    renderViewLess(onPress){
        console.log("inside render view less here lesss");
        console.log(onPress);
        if (this.state.descContHeight == 250) {
            this.setState({descContHeight: 400});        
        }
        return(
            <Text style={{left: 5, color: 'red'}} onPress={onPress}>Read less</Text>
        )
    }
}    