import {
    createStackNavigator,
    createBottomTabNavigator
} from "react-navigation";
import React, { Component, Fragment } from "react";
import {Platform, StyleSheet, Text, View, Linking, Button, TouchableWithoutFeedback, FlatList, Alert, TouchableOpacity, TouchableHighlight, Dimensions, ScrollView} from 'react-native';
import { Container, Content, Header, Title, Body, Right } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import axios from "axios";

export default class LikePage extends Component {  
    constructor(props) {
        super();
        const { data, navigation } = props;
        console.log("constructed value here isss thereeeeeee");
        console.log(data);
        console.log("final 123 valye here ussiiiiiii");
        console.log("data.post media is ==", data.post_media);
        console.log("http://70.51.251.63:3000/" + data.post_media[0]);
        this.state = {
            'postID': data._id,
            'likeCount': data.likes_count ? data.likes_count:0,
            'userLiked': data.user_liked,
            'navigation': navigation
        }
    }
   
    componentWillMount() {

    }

    render() {
        return (             
            <View style={{top: 20}}>
                <TouchableOpacity onPress={() => this.handleLikeButtonPress()}>
                    {this.state.userLiked ? <Icon name="heart" size={40} color="#FA3E44" /> :
                        <Icon name="heart-o" size={40} color="white" />}
                </TouchableOpacity>
                <Text style={[styles.likecount, {top: 6, left: 10, color: 'white'}]}>{this.state.likeCount > 0 ? this.state.likeCount: 0}</Text>
            </View> 
        );
    }
        
    async handleLikeButtonPress() {
        console.log("inside handle like button press value hereeee");
        console.log('this.state.userLiked/// ==', this.state.userLiked);
        //this.setState({userLiked: !this.state.userLiked});
        var token_val = await AsyncStorage.getItem('@user_auth:token'), formData = {}, likeCount = this.state.likeCount;
        console.log("token value here isss == ", token_val);
        formData['action'] = !this.state.userLiked;
        formData['post_id'] = this.state.postID;
        console.log("befire this iff calueee ==", this.state.likeCount);
        if (likeCount == NaN || likeCount < 0) {
            console.log("inside this ifff condition heree");
            //this.setState({likeCount: 0});
            likeCount = 0
        }
        if (this.state.userLiked) {
            console.log("inside liked condition hereee");
            formData['likes_count'] = likeCount - 1
        } else {
            console.log("inside not liked condition hereeee");
            formData['likes_count'] = likeCount + 1            
        }
        console.log("formadata value before passs isss");
        console.log(formData);
        console.log(token_val);
        if (token_val) {
            await axios.post('http://70.51.251.63:3000/likes/post/'+token_val, formData, {
                crossDomain: true
            }).then((response) => {
            //await axios.post('http://70.51.251.63:3000/likes/post/'+token_val, formData).then((response) => {    
                console.log("inside response value hereee 3334455556677888");
                console.log(response);
                console.log(formData);
                if (formData['action']) {
                    console.log("isnide here values aresss hereeeeeeee");
                    this.setState({userLiked: !this.state.userLiked, likeCount: likeCount + 1});
                } else {
                    console.log("going on hereeeeeeeee");
                    this.setState({userLiked: !this.state.userLiked, likeCount: likeCount - 1});
                }
            }, (error) => {
                console.log(error);
            });
        } else {
            Alert.alert(
                'Please Login to Like this Post',
                '',  
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  //  {text: 'OK', onPress: () => console.log('OK Pressed')},
                  {text: 'OK', onPress: () => this.state.navigation.navigate('SigninForm', { 'from': 1})}, 
                ],
                { cancelable: false }
              )
        }    
    }   
}
  
    const styles = StyleSheet.create({
        container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        //  padding: 30,
        //  marginTop: 3,
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            left: 120,
      //      backgroundColor: 'yellow', 
            alignSelf: 'flex-start'
        },
        button: {
            width:100, top:0, bottom: 0, left: 200
        },
        button2: {
            width:100, top:0, bottom: 0, left: 200
        },
        iconColor: {
            color :'#CD5C5C'
        },
        flex1: {
            flex: 1
        },
        left220: {left: 250, top: 0, bottom: 0},
        left100: {left: 100},
        iconContainer: {
            flexDirection: "row",
            justifyContent: "space-between"
        }
    });