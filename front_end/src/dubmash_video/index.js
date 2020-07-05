import {
  createStackNavigator, 
  createBottomTabNavigator, NavigationEvents
} from "react-navigation";
import React, { Component } from "react";
import {Platform, Modal, StyleSheet, Text, View, Linking, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Easing, NativeModules, Alert, AppState} from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage'
import Video from 'react-native-video';
import VideoControls from 'react-native-video-controls';
import ProgressBar from 'react-native-progress/Bar'
import Icon from "react-native-vector-icons/FontAwesome"
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import VideoEditing from 'react-native-video-editing';
import Share from 'react-native-share';
import { RNFetchBlob } from 'react-native-fetch-blob';
import firebase from 'firebase';
import { Container, Content, Header, Title, Body, Right, Left } from 'native-base';
import SoundPlayer from 'react-native-sound-player';
import Post from './post'
//import Row from './row_comp';


  function secondsToTime(time) {
      return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
  }

  var audioRecorderPlayer = new AudioRecorderPlayer();
  const path = Platform.select({
    ios: 'hello.m4a',
    android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
  });
  let video_url = "";
  let audio_url = "";
  let saved_url = null;
  let document_dir_video_url = "";
  let nFrom = "" //This value denotes from where we navigated from  
  export default class editor extends Component {  
  constructor() {
  //  console.log('/////////////inside dubmash constructor');
  //  console.log(Post);
  //  console.log(Post.Post);
      super();
      this.openPostPage = this.openPostPage.bind(this); 
      this.handleDoneButtonTouch = this.handleDoneButtonTouch.bind(this);
      this.checkPermission();
      //audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.1
      let audio_source = "";
      let audio_player_source = "";
  }

  state = {
    paused: true,
    progress: 0,
    progressAfterPause: 0,
    duration: 0,
    ismuted: true,
    muted: false,
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    audio_duration: '00:00:00',
    videoSaved: false,
    videoSaving: false,
    videoStats: 1,
    audioDuration: 0,
    audioDurationMilli: 0,
    videoEnded: false,
    demoDownloaded: false,
    onBlur: false,
    appState: AppState.currentState,
    modalVisible: false
  };

  componentWillMount() {
  //  console.log('99999999999999999999999999999999999999999999999999999999999999999999');
  //  console.log(firebase.auth());
  //  console.log(firebase.auth().currentUser);
  //  console.log("000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
    //console.log(navigation.getParam('from'));
  }

  componentDidMount() {
    // alert(this.state.ismuted.toString() + "Second Screen here");
  //  console.log('888888888888888888888888888888888888888888888888888888');
  //  console.log(firebase.auth());
  //  console.log(firebase.auth().currentUser);
    AppState.addEventListener('change', this._handleAppStateChange);    
    this.setState({ paused: false, muted: false }); 
  }
 
  componentDidUpdate() {
  //  console.log('inside component did update  //// here = '+ this.state.videoEnded + '  dss  '+ this.state.paused);
  //  console.log(this.state.videoStats);
  //  console.log(this.state);
    if (this.state.videoEnded && this.state.paused) {
  //    console.log('inside seek 000 hereeeeeeee');
      this.player.seek(0);
      //this.seekAudioToBeginning();
    } /* else if (this.state.videoStats == 2) {
      console.log('inside vide saved hereeee');
      this.showAfterSaveAlert();
    } */
  }

  componentWillUnmount() {
  //  console.log('inside unmount componenet hereeeeeeeeeeeeeeeeeeeeee');
    audioRecorderPlayer.stopPlayer();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
  //  console.log('inside handle app state changeeeeeeeeee');
  //  console.log(nextAppState);
  //  console.log(this.state.appState);
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
  //    console.log('App has come to the foreground!')
      this.setState({appState: nextAppState});
    } else {
      this.setState({appState: nextAppState, paused: true});
      audioRecorderPlayer.stopPlayer();
  //    console.log('inside else bloack in handle app state change');
    }
  }

  showAfterSaveAlert() {
  //  console.log('inside show after saveeeeeeeeeeeeeeeeeeeeeeeeeeeeeee alert hereeeeeingggg');
  //  console.log('nFrom ==', nFrom);
    if (nFrom == 'social') {
      Alert.alert(
        'Do you want to share this video with your friends?',
        '',  
        [
          {text: 'Cancel', onPress: () => this.props.navigation.navigate('SocialList'), style: 'cancel'},
          // {text: 'OK', onPress: () => console.log('OK Pressed')},
          {text: 'Ok', onPress: () => this.sharingVideo()}, 
        ],
        { cancelable: false }
      )
    } else {
      Alert.alert(
        'Do you want to share this video with your friends?',
        '',  
        [
          {text: 'Cancel', onPress: () => this.props.navigation.navigate('LandingScreen'), style: 'cancel'},
          // {text: 'OK', onPress: () => console.log('OK Pressed')},
          {text: 'Ok', onPress: () => this.sharingVideo()}, 
        ],
        { cancelable: false }
      )
    }  
    this.setState({videoStats: 1});
  }

  videoShaping(video, audio) {
    const option = {
        video: {
          source: video,
        },
        audio: {
          source: audio
        },
        videoQuality: VideoEditing.QUALITY_960x540
      }

    VideoEditing.MergeAudioVideo(option).then((newSource)=>{
        return newSource;
      }).catch((error)=>{
        return video;    
    });  
  }    

  async checkPermission() {
      if (Platform.OS !== 'android') {
          return Promise.resolve(true);
      }

      let result;
      try {
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, { title:'Microphone Permission', message:'Enter the Gunbook needs access to your microphone so you can search with voice.' });
      } catch(error) {
      //    console.error('failed getting permission, result:', result);
      }
    //  console.log('permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
  }

  handleMainButtonTouch = () => {
  //  console.log('while entering paused value ==', this.state.paused);
    this.setState(state => {
      return {
        paused: !state.paused,
      //  ismuted: !state.ismuted
      };
    });
  //  console.log('3333333333333333333');
  //  console.log(this.state.videoEnded);
  //  console.log(this.state.progress);
  //  console.log(this.state.paused);
    if (this.state.videoEnded && this.state.paused) {
  //    console.log('inside here 111111');
      this.setState({videoEnded: false});
      this.startAudioAgain();
    } else if (!this.state.paused) {
  //    console.log('else pause block here 2222222');
      this.pauseAudioPlayer();
    } else {
  //    console.log('audio start else block here going on 3333333333');
      this.audioStart();
    }
  };

  pauseAudioPlayer = async () => {
  //  console.log('inside pause audio player async');
  //  console.log(this.state.progress);
    await audioRecorderPlayer.pausePlayer();
  //  console.log(this.state.progress);
  //  console.log('after awaited here');
  }

  audioStart = async () => {
  //  console.log('inside audio start block here');
    await audioRecorderPlayer.startPlayer();
    if (this.state.progressAfterPause > 0) {
  //    console.log('inside seek 1 here');
      audioRecorderPlayer.seekToPlayer(this.state.progressAfterPause * 1000);
    } else {
  //    console.log('inside seek 2 here going on');
      audioRecorderPlayer.seekToPlayer(this.state.progress * 1000);
    } 
    this.setState({progressAfterPause: 0});
       //  console.log('after startibg ghere');
  }

  handleProgressPress = e => {
  //  console.log('inside handle progress presssssss');
    const position = e.nativeEvent.locationX;
    const progress = (position / 250) * this.state.duration;
    const isPlaying = !this.state.paused;
    
    this.player.seek(progress);
    this.setState({videoEnded: false, progressAfterPause: progress});
  //  console.log('just set the seekbar timing =', progress);
    const progress_millisec = progress * 1000;
  //  console.log('1000 muliii', progress_millisec);
  //  console.log(this.state.audioDurationMilli);
  //  console.log('////////');
  //  console.log(this.state.paused);
    if (this.state.audioDurationMilli > progress_millisec) {
  //      console.log('inside hereeeeeee');
        //audioRecorderPlayer.startPlayer(); 
        audioRecorderPlayer.seekToPlayer(progress_millisec);
  //      console.log('setted the value according to duration here');
      } else {
        //audioRecorderPlayer.pausePlayer();
  //      console.log('just like a health check here');
      }  
    };

  handleProgress = progress => {
  //  console.log('inside handle progress');
    this.setState({
      progress: progress.currentTime / this.state.duration,
    });
  //  console.log(this.state.progress);
  };

  handleEnd = () => {
  //  console.log('inside handle end here');
  //  console.log(audioRecorderPlayer);
    this.setState({ paused: true, videoEnded: true, progress: 0 });
    audioRecorderPlayer.stopPlayer();
  //  console.log('after handle end here', this.state.paused);
  //  audioRecorderPlayer.seekToPlayer(0);
  };

  handleLoad = meta => {
  //  console.log('inside handle load');
    this.setState({
      duration: meta.duration,
    });
    if(this.state.onBlur == false) {  
      this.onStartPlay();
    }  
  };
  
  onStartPlay = async () => {
  //  console.log('inside start playyyyyyyyyyyyyyyyyyyy');
  //  console.log(this.props.navigation.state.routeName);
    const msg = await audioRecorderPlayer.startPlayer();
  //  console.log(this.props.navigation.state.routeName);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        this.seekAudioToBeginning();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        audioDuration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        audioDurationMilli: e.duration
      });
      return;
    });    
  }

  seekAudioToBeginning = async() => {
  //  console.log('inside seek audio to beginning');
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.seekToPlayer(0);  
    this.setState({videoEnded: true});
  }

  startAudioAgain = async () => {
  //  console.log('inside start audio again');
    await audioRecorderPlayer.startPlayer();
  //  console.log('inside 1111');
    await audioRecorderPlayer.seekToPlayer(0);
  //  console.log('ended here');
  }

  render() {
    console.log("//////////////////////////////////////////////////////////<<<<<>>>>>>><<<>>>");
    const { width } = Dimensions.get("window");
    const height = width * 0.5625;
    const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) * (Dimensions.get('window') - 56 * 12);
    const { navigation } = this.props;
    let audio = navigation.getParam('audio');
    audio_source = audio;
    //console.log('inside dubmash rendererrrrrrrrrrrrrrrrrrrr');
    //console.log(firebase.auth().currentUser);
    //console.log(audio_source);
    let video = navigation.getParam('video_url');
    nFrom = navigation.getParam('nFrom');
    //console.log("n from <<<<<>>>>> // ==", nFrom);
    //console.log(video);
    video_url = video;
    audio_url = audio;
    //console.log(audio_url);
    //console.log(video_url);
    audio_player_source = navigation.getParam('audio_player');
    //console.log('after audio player souce inside hereeee');
    //console.log(audio_player_source);
    // let video_shaping = this.videoShaping(video, audio);   
    //console.log(this.state);
    return (
        <Container onBlur={this._onBlur} style={{backgroundColor: '#FFFFFF'}}>
          <NavigationEvents
            //onWillFocus={payload => console.log('will focus 44444444444444444444444444444444',payload)}
            //onDidFocus={payload => console.log('did focus 55555555555555555555555555555555555',payload)}
            //onWillBlur={payload => console.log('will blur 55555555555555555555555555555555555',payload)}
            onDidBlur={() => this._onBlur()}
          />
          <Header style={{backgroundColor: 'white'}}>
            <Body>
              <View>
                <Title style={[styles.titleText]}>Dubbed Video</Title>
              </View>
            </Body>
            <Right>
            </Right>
          </Header>
          <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>   
              {
                //{...Squirtle}
                <Post videoURL={video_url} state={this.state} changeState={this.openPostPage} saveVideo={this.handleDoneButtonTouch}/>
              } 
              
          </Modal>
          <View style={styles.container}>
            <Video source={{uri: `${video_url}`}}  // Can be a URL or a localfile.
              ref={(ref) => {
                this.player = ref
              }}                                      // Store reference
              onBuffer={this.onBuffer}                // Callback when remote video is buffering
              onError={this.videoError}               // Callback when video cannot be loaded
              style={styles.backgroundVideo} 
              navigator={ this.props.navigator }
              paused={this.state.paused}
              resizeMode="contain"
              onLoad={this.handleLoad}
              onProgress={this.handleProgress}
              onEnd={this.handleEnd}
              //muted={false}
              muted={this.state.ismuted}
            /> 

                <View style={[styles.controls]}>
                  <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                    <Icon name={!this.state.paused ? "pause" : "play"} size={15} color="#000000" />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.handleProgressPress}>
                    <View>
                      <ProgressBar
                        progress={this.state.progress}
                        color="#FA3E44"
                        unfilledColor="rgba(255,255,255,.5)"
                        borderColor="#FA3E44"
                        width={250}
                        height={10}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <Text style={styles.duration}>
                    {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
                  </Text>
                </View>  

                <View style={{flexDirection: 'row', marginTop: 320}}>  
                  { this.renderSaveButton() }  
                  <TouchableHighlight onPress={this.handleRetakeButtonTouch} style={{width:100, left:23, bottom:30}}>
                      <View>
                        <View style={{backgroundColor: "#FA3E44", height: 36, width: 36, borderRadius:50, borderWidth:1, borderColor:'#FA3E44'}}>
                          <Icon name="undo" size={20} style={{color :'white', left: 8, top: 5}}>
                          </Icon>
                        </View>  
                        <Text style={{top: 10, left: 1, fontSize: 15}}>Redo</Text>
                      </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={this.handleShareButtonTouch} style={{width:100, left:15, bottom:30}}>
                      <View>
                        <View style={{backgroundColor: "#FA3E44", height: 36, width: 36, borderRadius:50, borderWidth:1, borderColor:'#FA3E44'}}>
                          <Icon name="share-alt" size={20} style={{color :'white', left: 8, top: 5}}>
                          </Icon>
                        </View>  
                        <Text style={{top: 10, left: 3, fontSize: 15}}>Share</Text>
                      </View>
                  </TouchableHighlight>
                </View>

                <View>
                  {this.state.videoSaving == true ? <Text style={styles.statusText}>Saving ...</Text> : <Text> </Text>}
                </View>

                <View>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => {this.openPostPage();}}
                    >
                        <Text style={styles.previewpostbtntext}> Post </Text>
                    </TouchableOpacity>
                </View>
          </View>
        </Container>      
    );
  }  

  openPostPage() {
  //  console.log('inside this open post pageeeeee heerrreeeeee');
  //  console.log(firebase.auth().currentUser.displayName);
    if (firebase.auth() && firebase.auth().currentUser && firebase.auth().currentUser.displayName && (firebase.auth().currentUser.displayName == null || firebase.auth().currentUser.displayName.length > 10) ) {
      // alert('inside firebase auth display name check functionnnn');
       Alert.alert(
         'Please enter display name before saving video',
         '',  
         [
           {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
           // {text: 'OK', onPress: () => console.log('OK Pressed')},
           {text: 'OK', onPress: () => this.props.navigation.navigate('EditAccDetailsPage', { 'from': 'dubmash'})}, 
         ],
         { cancelable: false }
       )
    } else if (firebase.auth() && firebase.auth().currentUser) {
      this.setState({modalVisible: !this.state.modalVisible});
    } else { 
      Alert.alert(
        'Please Login Before Saving your video',
        '',  
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          // {text: 'OK', onPress: () => console.log('OK Pressed')},
            {text: 'OK', onPress: () => this.props.navigation.navigate('SigninForm', { 'from': 1})}, 
        ],
        { cancelable: false }
      )
    }  
  }

  _onBlur() {
  //  console.log('inside this.on blur eventssss blur()blur()blur()blur()blur()blur()blur()blur()');
  //  console.log(this.state.modalVisible);
    audioRecorderPlayer.stopPlayer();
    if (this.state && !this.state.modalVisible) {
  //    console.log("inside set state here");
      this.setState({onBlur: true, paused: true});
    }
  }
  
  renderSaveButton = () => {
      if (this.state.videoSaved == false) {
        return (
          <View style={{flexDirection: 'row', left:30}}> 
            <TouchableHighlight onPress={this.handleDoneButtonTouch} style={{width:100, bottom:30}} pointerEvents="none">
              <View>
                <View style={{backgroundColor: "#FA3E44", height: 36, width: 36, borderRadius:50, borderWidth:1, borderColor:'#FA3E44'}}>
                  <Icon name="download" size={20} style={{color :'white', left: 8, top: 5}}>
                  </Icon>
                </View>
                <Text style={{'right': 6, top: 10, left: 3, fontSize: 15}}>Save</Text>
              </View>
            </TouchableHighlight>
          </View>  
        );
      } else { 
        return (
          <View style={{flexDirection: 'row', left:30}}> 
            <TouchableHighlight onPress={this.handleDoneButtonTouch} style={{width:100, bottom:30}} pointerEvents="none">
              <View>
                <View style={{backgroundColor: "#FA3E44", height: 36, width: 36, borderRadius:50, borderWidth:1, borderColor:'#FA3E44'}}>
                  <Icon name="download" size={20} style={{color :'white', left: 8, top: 5}}>
                  </Icon>
                </View>
                <Text style={{'right': 6, top: 10, fontSize: 15}}>Saved</Text>
              </View>
            </TouchableHighlight>
          </View>   
        );
      }  
  } 

  sendVerificationEmail() {
  //  console.log('inside send verification email');
  //  console.log(firebase.auth().currentUser);
    if (firebase.auth().currentUser) {
      firebase.auth().onAuthStateChanged(function(user) {
        user.sendEmailVerification(); 
      });
    }  
    alert('verification email sent, please verify');
  }

  //handleDoneButtonTouch = (from) => {
  async handleDoneButtonTouch(from, postFunc) {
    // onPress={() => this.props.navigation.navigate('EditorScreen', { 'video_url': rowData, 'loaded': true, 'from': 'home'})}
    this.postFunc = postFunc;
    console.log(firebase.auth().currentUser);
    var token_val = await AsyncStorage.getItem('@user_auth:token');
  //  if (firebase.auth().currentUser) {    
  //      console.log('inside 11111');
    if (token_val || true) {
        if (this.state.videoSaving == true) {
          alert('Saving is in progress ... Please wait for a moment'); 
          return;
        }  else if (firebase.auth() && firebase.auth().currentUser && !firebase.auth().currentUser.emailVerified) {
          Alert.alert(
            'Please verify your email before saving your videos',
            '',  
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.sendVerificationEmail()}, 
            ],
            { cancelable: false }
          )
        } /* else if (firebase.auth().currentUser.displayName && (firebase.auth().currentUser.displayName == null || firebase.auth().currentUser.displayName.length > 10) ) {
          Alert.alert(
            'Please enter display name before saving video',
            '',  
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.props.navigation.navigate('EditAccDetailsPage', { 'from': 'dubmash'})}, 
            ],
            { cancelable: false }
          )
        } */
        else if (this.state.videoSaved == true) {
          if (from != 'post') {
            alert('Already saved this video');
          } else {
            this.postFunc();
          }    
        } else if (video_url.substring(0,4) != "http") {
          if (from != 'post') {
            this.setState({
              videoSaving: true  
            }); 
          }  
          await this.mergeFiles(audio_url, video_url, 1, from);      
        } else {
          if (from != 'post') {
            this.setState({
              videoSaving: true  
            });
          }  
          await this.download(from);
        }      
    } else {
        Alert.alert(
          'Please Login Before Saving your video',
          '',  
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            // {text: 'OK', onPress: () => console.log('OK Pressed')},
              {text: 'OK', onPress: () => this.props.navigation.navigate('SigninForm', { 'from': 1})}, 
          ],
          { cancelable: false }
        )
    }     
  };

  async mergeFiles(audio_src, video_src, source, from) {
//    console.log('inside merge files here');
    let str_to_remove = "file://";
    let reg = new RegExp(str_to_remove);
//    console.log(audio_src);
//    console.log(video_src);
    let audio_url1 = audio_src.replace(reg, '');
    let video_url1 = video_src.replace(reg, '');
    let that = this;
    let currentUser = firebase.auth().currentUser;
//    console.log(currentUser);
//    console.log("888888888888888888888888888888");
//    console.log(firebase.auth().currentUser);
//    console.log(firebase.auth().currentUser.displayName);
    console.log("before mergin g hereee")
    NativeModules.MashDubVideoPrep.mergeFilesWithUrl(video_url1, audio_url1, "@Random", function(error, response) {
        saved_url = response.destinationPath;
        that._storeData(saved_url, currentUser, from);
    });    
  }

  download(from){
//    console.log('entereed download function going on hereeeeeeee');
    var RNFetchBlob = require('react-native-fetch-blob').default;
    var date = new Date();
    //var url = "http://www.clker.com/cliparts/B/B/1/E/y/r/marker-pin-google-md.png";
    //var url = "https://youtu.be/rUWxSEwctFU";
    var url = video_url;
//    console.log('video url under download fb ==', url);
    var ext = this.extention(url);
    ext = "."+ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.DocumentDir + '/' + this.makeid(8);
//    console.log|(PictureDir);
//    console.log("fetching value starts hereeeeeee");
    let options = {
      fileCache: true,
      path : PictureDir,
      addAndroidDownloads : {
        useDownloadManager : true,
        notification : true,
        path:  PictureDir + "/image_"+Math.floor(date.getTime() + date.getSeconds() / 2)+ext,
        description : 'Image'
      }
    }
//    console.log('after download heree going on');
    config(options).fetch('GET', url).then((res) => {
      //Alert.alert("Success Downloaded");
      document_dir_video_url = res.data;
//      console.log(audio_url);
//      console.log(res.data);
      this.mergeFiles(audio_url, res.data, 2, from);
    }); 
  }

  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result = result + '.mp4';
    return result;
  }

  extention(filename){
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
  }

  _storeData = async (saved_url, userAuthDetails, from) => {
//    console.log("inside store data value here isss");
    var saved_value = '';
    var no_video_saved = false;
    let userId = (userAuthDetails && userAuthDetails.uid) || 'Random';
    var video_urls = {};
    video_urls[userId] = [];    
    /* AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => alert('success'));   */
  //  console.log('deleting fn beforeeeeeeeeeeeee');
  /*  try {
      AsyncStorage.removeItem('@jm_video_urls:key');
    }
    catch(exception) { 
    }  */ 
//   console.log(userAuthDetails);
//   console.log(userAuthDetails.uid);
//   console.log(userId);
   try {
//     console.log('inside try block heree');
      saved_value = await AsyncStorage.getItem('@jm_video_urls:key');
//      console.log(saved_value);
//      console.log(saved_value[userId]);
      let parsed = null;
      if (saved_value != null) {
        parsed = JSON.parse(saved_value);
//        console.log(parsed);
//        console.log(parsed[userId]);        
      }  
//      console.log('crossedddd 12345');
      if (saved_value !== null && parsed && parsed[userId]) {
//        console.log('1111111');
        no_video_saved = false;
      } else {
//        console.log('22222222');
        no_video_saved = true;
      }
//      console.log(no_video_saved);
    } catch (error) {
//      console.log(error);
    }
//    console.log(no_video_saved);
//    console.log('///////////////////////');
//    console.log(saved_value);
//    console.log(video_urls);
//    console.log(video_urls[userId]);
    if (no_video_saved == true && saved_value == null) {
//      console.log('11111111111111111');
        video_urls[userId] = [...video_urls[userId], saved_url];
    } else {
//      console.log('elsssseeeeeeeeeeeee');
        saved_value = JSON.parse(saved_value);
//        console.log(saved_value);
//        console.log(userId);
        if (saved_value[userId] == null || saved_value[userId] == undefined) {
          saved_value[userId] = [];
        }
        saved_value[userId] = [...saved_value[userId], saved_url];  
//        console.log(saved_value[userId]);
        video_urls = saved_value;
    }
//    console.log('after everything here');
//    console.log(video_urls);
    try {
      await AsyncStorage.setItem('@jm_video_urls:key', JSON.stringify(video_urls));
      
    } catch (error) {
//      console.log(error);
    }   
    if (from != 'post') {
      this.showAfterSaveAlert();
    } else if (from == 'post') {
//      console.log("inside else from == post value hereee");
      this.postFunc();
      //alert("Successfully posted");
    } 
    this.setState({
      videoSaved: true, videoSaving: false, videoStats: 2
    }) 
  }; 

  handleShareButtonTouch = () => {
    if (firebase.auth().currentUser) {
      if (!firebase.auth().currentUser.emailVerified) {
        Alert.alert(
          'Please verify your email before saving your videos',
          '',  
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            // {text: 'OK', onPress: () => console.log('OK Pressed')},
            {text: 'OK', onPress: () => this.sendVerificationEmail()}, 
          ],
          { cancelable: false }
        )
        return;
      } else if (firebase.auth().currentUser.displayName && (firebase.auth().currentUser.displayName == null || firebase.auth().currentUser.displayName.length > 10) ) {
        //alert('inside firebase auth display name check functionnnn');
        Alert.alert(
          'Please enter display name before saving video',
          '',  
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            // {text: 'OK', onPress: () => console.log('OK Pressed')},
            {text: 'OK', onPress: () => this.props.navigation.navigate('EditAccDetailsPage', { 'from': 'dubmash'})}, 
          ],
          { cancelable: false }
        )
      } else if(saved_url != null) {
        this.sharingVideo();
      } else {
        //this.handleDoneButtonTouch();
        this.sharingVideo();
      }
    } else {
      //alert('Please Login Before Sharing your videos');  

      Alert.alert(
        'Please Login Before Sharing your video',
        '',  
        [
           {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //   {text: 'OK', onPress: () => this.props.navigation.navigate('SigninForm')}, 
           {text: 'OK', onPress: () => this.props.navigation.navigate('SigninForm', { 'from': 1})}
        ],
        { cancelable: false }
      )

    }    
  }
  
  handleRetakeButtonTouch = () => {
  //  console.log('before navigate here');
    audioRecorderPlayer.stopPlayer();
    this.videoSaved = false;
    this.setState({'paused': true});
    this.props.navigation.replace('EditorScreen');
    this.props.navigation.navigate('EditorScreen', { 'video_url': video_url, 'loaded': false});
  }

  sharingVideo = () => {
  //  console.log('sharing video now here ========');
  //  console.log('inside sharing videos hereeeeeeeeeeeeeeeeeeeeeeeeeeeeee 8888888888888');
  //  console.log(saved_url);
    if (saved_url) {
      var RNFetchBlob = require('react-native-fetch-blob').default;
      let filePath = null;
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.DocumentDir + '/MashDub.mp4';
      const configOptions = {
        fileCache: true,
        path: PictureDir
      };
    
      RNFetchBlob.config(configOptions)
      .fetch('GET', saved_url)
      .then(async resp => {
        filePath = resp.path();
        let options = {
          type: 'mp4',
          url: filePath // (Platform.OS === 'android' ? 'file://' + filePath)
        };
        await Share.open(options);
        // remove the image or pdf from device's storage
        await RNFS.unlink(filePath);
      });

    } else {
      alert("Please save video before you share");
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  //  backgroundColor: '#F5FCFF',
  //  padding: 30,
  //  marginTop: 3,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101010',
    left: 85,
//      backgroundColor: 'yellow', 
    alignSelf: 'flex-start'
  },
  statusText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'green',
    alignItems: 'center',
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
    width: "100%",
    height: 250
    //marginBottom: 260
  },
  controls: {
    backgroundColor: "#ffffff",
    height: 15,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 260
  },
  mainButton: {
    marginRight: 15,
  },
  duration: {
    //color: "#FFF",
    color: "#000000",
    marginLeft: 15,
  },
  button: {
    alignItems: 'center',
  //  backgroundColor: '#DDDDDD',
      backgroundColor: '#CD5C5C',
      padding: 10
  },
  innerCircle: {
    borderRadius: 35,
    width: 50,
    height: 50,
    backgroundColor: 'black'
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#FA3E44',
    padding: 10,
    borderRadius: 30,
    width: 135,
    height: 40,
    top: 10
  },
  previewpostbtntext:{
    color: '#fff',
    fontSize: 17
  },
});