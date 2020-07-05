import {
    createStackNavigator,
    createBottomTabNavigator,
    StackActions, NavigationActions
  } from "react-navigation"; 
  import React, { Component } from "react";
  import {Platform, StyleSheet, Image, Text, View, Linking, Button, TouchableWithoutFeedback, Dimensions, ScrollView, ListView, TouchableHighlight} from 'react-native';
  import { ListItem, FlatList } from 'react-native-elements';
  import Video from 'react-native-video';
  import VideoControls from 'react-native-video-controls';
  import ProgressBar from 'react-native-progress/Bar'
  import Icon from "react-native-vector-icons/FontAwesome"
  import Row from './row_comp';
  import Masonry from 'react-native-masonry-layout';
  import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage, CardItem } from 'react-native-material-cards';
  import firebase from 'firebase';
  import { Container, Content, Header, Title, Body, Right } from 'native-base';
  import { FloatingAction } from "react-native-floating-action";
  import ActionButton from 'react-native-action-button';
  import { TouchableOpacity } from "react-native-gesture-handler";
  import {RNCamera} from 'react-native-camera';

  const data = new FormData();
  let video_url = '';
  export default class video_recorder extends Component {  
    constructor() {
      super();
      this.checkPermission();
      this.state = {video: '', timer: null,
                    minutes_Counter: '00',
                    seconds_Counter: '00',
                    startDisable: false };
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    componentDidUpdate() {
        console.log("innnerrrrrr component did updateeeeeeeerrrrrrrrttttt");
        if (Number(this.state.seconds_Counter) >= 10) {
          console.log('inside if condition hereeee');
          this.stopRecording('counter');
        }
    }
    
    async checkPermission() {
      if (Platform.OS !== 'android') {
          return Promise.resolve(true);
      }

      let result;
      try {
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, { title:'Microphone Permission', message:'Enter the Gunbook needs access to your microphone so you can search with voice.' });
      } catch(error) {
          console.error('failed getting permission, result:', result);
      }
      console.log('permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    }

    async startRecording() {
        alert('start recordign hereeeee');
       // this.setState({ recording: true });
        // default to mp4 for android as codec is not set
        const options = {
        //  mirrorVideo: false,
          quality: RNCamera.Constants.VideoQuality["288p"],
          mute:false,
          audio: true,
          captureAudio: true,
          maxDuration: 10,
//          base64: true,
//          forceUpOrientation: true,
//          fixOrientation: true,
        };
      //  alert(options);
        const { uri, codec = "mp4" } = this.camera.recordAsync(options);
        const type = `video/${codec}`;
        alert('started  hereee');
        console.log('after syaty record hereeeeeeeeeee');
        video_url = uri;
        data.append("video", {
            name: "mobile-video-upload",
            type,
            uri
        }); 

        let timer = setInterval(() => {
 
          var num = (Number(this.state.seconds_Counter) + 1).toString(),
            count = this.state.minutes_Counter;
     
          if (Number(this.state.seconds_Counter) == 59) {
            count = (Number(this.state.minutes_Counter) + 1).toString();
            num = '00';
          }
     
          this.setState({
            minutes_Counter: count.length == 1 ? '0' + count : count,
            seconds_Counter: num.length == 1 ? '0' + num : num
          });
        }, 1000);
        this.setState({ timer });
     
        this.setState({startDisable : true, recording: true})
    }
    
    async stopRecording(from) {
        //alert('inside stop recording /// future hereeeeee');
        //alert(video_url);
        console.log('inside stop recorrddddiiingngngngn blockkk hereeee');
        if (from != 'counter') {
          console.log('after from block hereeeee');
          this.camera.stopRecording();
        }  
        this.renderEditingScreen(video_url);
        console.log('after stop recordddddddddd');
        clearInterval(this.state.timer);
        this.setState({startDisable : false, recording: false, timer: null, minutes_Counter: '00', seconds_Counter: '00'});
    }

    renderEditingScreen(video_url) {
      console.log('inside render editing screen going on hereee');
      this.props.navigation.navigate('EditorScreen', { 'video_url': video_url, 'loaded': true, 'from': 'home'});
    }

    render() {
        const { recording, processing } = this.state;
    
        let button = (
          <TouchableOpacity
            onPress={this.startRecording.bind(this)}
            style={styles.capture}
          >
            <Text style={{ fontSize: 14 }}> RECORD </Text>
          </TouchableOpacity>
        );
    
        if (recording) {
          button = (
            <TouchableOpacity
              onPress={this.stopRecording.bind(this)}
              style={styles.capture}
            >
              <Text style={{ fontSize: 14 }}> STOP </Text>
            </TouchableOpacity>
          );
        }
    
        if (processing) {
          button = (
            <View style={styles.capture}>
              <ActivityIndicator animating size={18} />
            </View>
          );
        }
    
        return (
          <View style={styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={"Permission to use camera"}
              permissionDialogMessage={
                "We need your permission to use your camera phone"
              }
            />
            <Text style={styles.counterText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
            <View
              style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}
            >
              {button}
            </View>
          </View>
        );
    }  
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
       },
    button: {
      alignItems: 'center',
    //  backgroundColor: '#DDDDDD',
        backgroundColor: '#CD5C5C',
        padding: 10
    },
    countContainer: {
      alignItems: 'center',
      padding: 10
    },
    countText: {
      color: '#FF00FF'
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      left: 135,
  //      backgroundColor: 'yellow', 
        alignSelf: 'flex-start'
    },
    counterText:{
      fontSize: 28,
      color: '#FFF',
      paddingLeft: 160
    }
  });
