import {
    createStackNavigator,
    createBottomTabNavigator,
    StackActions, NavigationActions
  } from "react-navigation"; 
  import React, { Component } from "react";
  import {Platform, StyleSheet, Image, Text, View, Linking, Button, TouchableWithoutFeedback, Dimensions, ScrollView, ListView, TouchableHighlight} from 'react-native';
  import { ListItem, FlatList } from 'react-native-elements';
  import Video from 'react-native-video';
  import VideoControls from 'react-native-video-controls';
  import ProgressBar from 'react-native-progress/Bar'
  import Icon from "react-native-vector-icons/FontAwesome"
  import Row from './row_comp';
  import Masonry from 'react-native-masonry-layout';
  import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage, CardItem } from 'react-native-material-cards';
  import firebase from 'firebase';
  import { Container, Content, Header, Title, Body, Right } from 'native-base';
  import { FloatingAction } from "react-native-floating-action";
  import ActionButton from 'react-native-action-button';

  export default class home extends Component {  
    constructor() {
      super();
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        items: ds.cloneWithRows([
          'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
        ]),
        video: '',
        muteCheck: true,
        video_url: ds.cloneWithRows(['https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Video2.mp4', 'https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/video4.mp4']),
      //  video_urls: ['https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Video2.mp4', 'https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/video4.mp4']
        video_urls: ['https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Kaththi+Mass+Dialog+Vijay+whatsapp+status+++Tamil+whatsapp+status+mp4.mp4', 'https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Thala+Ajith+Mass+Punch+Dialogues.mp4']
      };
      this._renderRow = this._renderRow.bind(this);
      //this.download();
    }
    
    onPressImage = value => {
      console.warn(value);
    };

    _renderRow(rowData) {
      console.log('inside _renderrow');
      console.log(rowData);
      return(
        <TouchableHighlight
              onPress={() => this.props.navigation.navigate('EditorScreen', { 'video_url': rowData, 'loaded': true, 'from': 'home'})}
            >
            <Video source={{uri: rowData}}   // Can be a URL or a localfile.
                  ref={(ref) => {
                    this.player = ref
                  }}     
                  //muted={true}                                 // Store reference
                  muted={this.state.muteCheck}
                  onBuffer={this.onBuffer}                // Callback when remote video is buffering
                  onError={this.videoError}               // Callback when video cannot be loaded
                  resizeMode="cover"
                  onLoad={() => {
                    this.player.seek(0);
                  }}
                  minLoadRetryCount={5}
                  style={video_row_styles.video}/>  
        </TouchableHighlight>                  
      );      
    }

    _getVideos() {
      const options = { 
        noData: true,
        mediaType: 'video'
      };
      var ImagePicker = require('react-native-image-picker');
      ImagePicker.launchImageLibrary(options, response => {
          if (response.uri) {
            this.setState({video: response});
            //console.log(this.props.navigation.dangerouslyGetParent());
            this.props.navigation.navigate('EditorScreen', { 'video_url': response.uri, 'loaded': false, 'from': 'home'});
          }
      });
    }

    render() {
      console.log('oooooooooooooooooooooooooooooooooooooooooo');
      console.log(firebase.auth());
      console.log(firebase.auth().currentUser);
      return (
        <Container style={{backgroundColor: '#FFFFFF'}}>
          <Header style={{backgroundColor: '#F2F2F2'}}>
            <Body>
              <Title style={styles.titleText}>Me-Me</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          
          <View style={{flex: 1}}>
            <ScrollView style={{paddingTop: 20}}>
                  {
                    this.state.video_urls.map((video_url, index) => (
                      <View key = {index}>
                          {this._renderRow(video_url)}                  
                      </View>
                    ))
                  }       
              </ScrollView>     
              <ActionButton
                buttonColor="#CD5C5C"
                style={{position: 'absolute'}}
                onPress={() => { this._getVideos()}}
              />       
            </View> 
          </Container>
      ); 
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
      fontSize: 35,
      fontWeight: 'bold',
      //color: '#101010',
      color: "#FA3E44",
      left: 130,
//      backgroundColor: 'yellow', 
      alignSelf: 'flex-start',
      fontFamily: 'Cochin-BoldItalic'
    },   
    plusButton: {
      width: 60,  
      height: 60,   
      borderRadius: 30,            
      backgroundColor: '#ee6e73',                                    
      position: 'absolute',                                          
      bottom: 10,                                                    
      right: 0, 
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      height: 150,
      width: 150,
    },
    controls: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      height: 48,
      left: 0,
      bottom: 0,
      right: 0,
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingHorizontal: 10,
    },
    mainButton: {
      marginRight: 15,
    },
    duration: {
      color: "#FFF",
      marginLeft: 15,
    },
  });
  

  const video_row_styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      marginLeft: 12,
      fontSize: 16,
    },
    photo: {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    videoContainer: {
      flex: 1,
      backgroundColor: 'black',
    },
    video: {
      flexDirection: 'row',
      padding: 100,
      margin: 2,
      borderColor: '#2a4944',
      borderWidth: 1,
      backgroundColor: 'white'
    },
  });