  import {
    createStackNavigator,
    createBottomTabNavigator, NavigationEvents
  } from "react-navigation"; 
  import React, { Component } from "react";
  import {Platform, StyleSheet, Text, View, Linking, Button, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Dimensions, Animated, Easing, Alert, AppState} from 'react-native';
  import Video from 'react-native-video';
  import VideoControls from 'react-native-video-controls';
  import ProgressBar from 'react-native-progress/Bar'
  import Icon from "react-native-vector-icons/FontAwesome"
  import Icon2 from 'react-native-vector-icons/Ionicons'; 
  import AudioRecorderPlayer from 'react-native-audio-recorder-player';
  import firebase from 'firebase';
  import { Container, Content, Header, Title, Body, Right, Left } from 'native-base';
  import * as Animatable from 'react-native-animatable';
  import Share from 'react-native-share';
  var RNFS = require('react-native-fs'); 
  import AsyncStorage from '@react-native-community/async-storage';
  import RNFetchBlob from 'react-native-fetch-blob';
  import Spinner from 'react-native-loading-spinner-overlay';
  import Permissions from 'react-native-permissions';
  import axios from "axios";
  import ModalDropdown from 'react-native-modal-dropdown';
  import ViewMoreText from 'react-native-view-more-text';

    function secondsToTime(time) {
      return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
    }

    let audioRecorderPlayer = new AudioRecorderPlayer();
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });

    let videoSource = '', videoLength = '', from = '';
    const maxOpacity = 0.12;
    var videoIndex = null, videoSeekToZero = false, postID = '', postType = 0, description = undefined;

    export default class editor extends Component {  
      constructor() {
        super();
        //alert("inside editor constructor here");
        this.checkPermission();
        if (audioRecorderPlayer) {
          audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
        }  
      }
    
    componentWillMount() {      
      this.setState(state => { return {muted: true}});
    }  

    componentDidMount() {
      var that = this;
      //AppState.addEventListener('change', this._handleAppStateChange);
    /*  setTimeout(function() {
        that.setState(state => { return {muted: false}});
      }, 50);  */
    //  console.log(this.state.muted);
    /*  Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration: 225,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      }).start(); */
    //  alert("inside component did mount here")
      Permissions.request('microphone').then(response => {
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({microphonePermission: response});
      });
    }

    componentWillUnmount() {
      //alert("inside component will unmount here");
      // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        this.setState({appState: nextAppState});
      } else {
        this.setState({appState: nextAppState, paused: true});
      }
    }

    componentDidUpdate() {
      if (this.state.videoEnded && this.state.paused && !this.state.recording) {
        this.player.seek(0);
        this.setState({videoEnded: false, spinner: false});
      } /*else if (this.state.playAudioVideo == true) {
        console.log('inside play audio video place');
        //this.player.seek(0);
        this.setState({playAudioVideo: false, videoEnded: false});
      }  else if (this.state.startAudioRecord == true) {
        console.log('inside 333333333');
        //this.player.seek(0);
        this.setState({startAudioRecord: false, muted: true, paused: false});
      } */
    }

    async checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        let result;
        try {
            result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, { title:'Microphone Permission', message:'Enter the Gunbook needs access to your microphone so you can search with voice.' });
        } catch(error) {
        }
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    }
    

    state = {
      paused: false,
      progress: 0,
      duration: 0,
      muted: true,
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      ignoreSilentSwitch: "ignore", 
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      maxOpacity,
      scaleValue: new Animated.Value(0.01),
      opacityValue: new Animated.Value(maxOpacity),
      recording: false,
      recordingText: '',
      recordEnded: false,
      videoEnded: false,
      playAudioVideo: false,
      startAudioRecord: false,
      firstTime: true,
      ismuted: true,
      spinner: false,
      microphonePermission: false,
      appState: AppState.currentState,
      likeCount: 0,
      textShown: false,
      postType: undefined
    };
    
    handleMainButtonTouch = () => {
      //alert("rendereddddd hereeee");
      if (this.state.progress >= 1) {
      //  this.player.seek(0);
      }
  
      this.setState(state => {
        return {
          paused: !state.paused, muted: false
        };
      });
    };
  
    handleRecordButtonTouch = (from) => {
      if (!this.state.recording || from == 2) {
 //       alert('inside state check recording');
        this.setState(state => {
          return {
            paused: false,
            muted: true,
            startAudioRecord: true,
            recording: true,
            recordingText: 'Preparing ...'
          };
        });
        this.seekVideoToBeginning(from);
      }

  //    this.player.seek(0);
 //     alert('before start record here'); 
    }

    seekVideoToBeginning = async(from) => {
      //alert('inside here seekvideo');
      await this.player.seek(0);
      videoSeekToZero = true;
      this.onStartRecord(from);
    }

    //onStartRecord = async () => {
    onStartRecord(from) {
        var that = this;
//        if (this.state.muted) {
      //    console.log('entered muted check if condition here');
      //  this.player.seek(0);
          //setTimeout(function() {
          setTimeout(() => {
              if (from == 2) {
                audioRecorderPlayer.stopRecorder();
                audioRecorderPlayer.removeRecordBackListener();
                audioRecorderPlayer=null;
              }
            //  alert('after set time out fn here');
              if (audioRecorderPlayer == null) {
              //   console.log("inside null check heree going on");
                 audioRecorderPlayer = new AudioRecorderPlayer();
                 audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1 
              } 
              result = audioRecorderPlayer.startRecorder();
              //this.player.seek(0);
//              alert(this.state);
              if (this.state.paused) {
                audioRecorderPlayer.addRecordBackListener((e) => {
                  this.setState({
                    recordSecs: e.current_position,
                    recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
                  //  paused: false
                  });
                  return;
                });
              } else {
               // alert('inside 22222222 alert false');
                audioRecorderPlayer.addRecordBackListener((e) => {
                  this.setState({
                    recordSecs: e.current_position,
                    recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
                  //  paused: false
                  });
                  return;
                });
              }
              
            //  alert('after starting record here ==', this.state.recordSecs);
              this.setState({recordingText: 'Recording ...', paused: false});
            //  this.player.seek(0);
        //      console.log('after text returning here');
          }, 50); 
    }

    handleProgressPress = e => {
      const position = e.nativeEvent.locationX;
      const progress = (position / 250) * this.state.duration;
      const isPlaying = !this.state.paused;
      this.player.seek(progress);
      //this.player.seek(0.0);
    };
  
    handleProgress = progress => {
      this.setState({
        progress: progress.currentTime / this.state.duration,
      });
    };
  
    handleEnd = () => {
    //  alert("inside handle enddd hereeeeeee");
      console.log("inside handle end value here 333444555666777888111222999");
      this.setState({ paused: true, videoEnded: true, progress: 0 });
      
    //  console.log('inside handle end here');

      if (this.state.recording == true) {
        /*this.setState({
          recording: false,
          recordingText: ''
        }); */
       // this.setState({spinner: true});
       // this.state.opacityValue.stopAnimation(({value}) => console.log("Final Value: " + value));
        //this.player.seek(0);
        /* this.setState({
          recordSecs: 0
        }); */ 
      //  alert('crossing handle end check fn after true');
      //  console.log('before on stop record');
        this.onStopRecord();
      } else {
        this.setState({muted: true, paused: true});
      }
    };
  
    handleLoad = meta => {
    //  console.log('inside meta duration goin hereeee iss ===', meta.duration);
      this.setState({
        duration: meta.duration,
        muted: false
      });
    };
     
    onStopRecord = async () => {
    //onStopRecord() {
    //  console.log('inside stop record heree one by one one by one one by oneeeeee');
        if (this.state.progress > 0) {
          //  console.log('inside seek before');
          //  this.player.seek(0);
        } 
        //result = await audioRecorderPlayer.stopRecorder();
        result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        //alert('after stop recording and before play video');
        //this._playAudioVideo();
        this.setState({
          recordSecs: 0,
          paused: true,
          playAudioVideo: true,
          recording: false,
          recordingText: '',
          recordEnded: true,
          spinner: false
          //opacityValue: opacityValue.stopAnimation(({value}) => console.log("Final Value: " + value)),
        });
      //  console.log(result);
      //  alert('after setting state finally =', result);
        this._playAudioVideo();
        //audioRecorderPlayer = null;
    }
     
    onStartPlay = async () => {
    //  console.log('onStartPlay');
      if (this.state.progress > 0) {
      //  console.log('inside start playing');
        const msg = await audioRecorderPlayer.startPlayer();
      //  console.log(msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.current_position === e.duration) {
        //    console.log('finished');
            audioRecorderPlayer.stopPlayer();
          }
          this.setState({
            currentPositionSec: e.current_position,
            currentDurationSec: e.duration,
            playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
            duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
          });
          return;
        });
      }  
    }
     
    onPausePlay = async () => {
      await audioRecorderPlayer.pausePlayer();
    }
     
    onStopPlay = async () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    }
    
    renderEditActionButtons = (from, likeCount) => {
      if (from == 'home' || from == "social") {
        return (
          <React.Fragment>
                  
                <View style={{flexDirection: 'row', marginTop: 290}}>
                  <TouchableOpacity onPress={this.onPressedOut.bind(this)}
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
                  >
                    <Animated.View
                      style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 60,
                          height: 60,
                          borderRadius: 50,
                          transform: [{ scale: this.state.scaleValue }],
                          opacity: this.state.opacityValue,
                          backgroundColor: '#FA3E44',
                      }}
                    />
                    <Icon name={"microphone"} size={30} color="white"/>
                  </TouchableOpacity>
                </View>  

                <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 15}}>                  
                  <Text style={styles.statusTextStyle}>
                     {this.state.recordingText}
                  </Text>
                </View>
                
                <View style={{flexDirection: 'row', marginTop: 16}} pointerEvents={this.state.recording ? 'auto' : 'none'}>
                  <TouchableOpacity onPress={this.redo.bind(this)}
                    style={{
                        borderWidth:1,
                        borderColor:'#FA3E44',
                        alignItems:'center',
                        justifyContent:'center',
                        width:50,
                        height:50,
                        backgroundColor:'#FA3E44',
                        borderRadius:50
                      }}
                  >
                    <Animated.View
                      style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          transform: [{ scale: this.state.scaleValue }],
                          opacity: this.state.opacityValue,
                          backgroundColor: '#FA3E44',
                      }}
                    />
                    <Icon name={"undo"} size={20} color="white"/>
                  </TouchableOpacity>
                </View>  

                <View style={{flexDirection: 'row', marginTop: 10}}>                  
                  <Text style={styles.statusTextStyle}>
                      Redo
                  </Text>
                </View> 
          </React.Fragment>               
        );
      } else {
      var postTypeVal = this.state.postType !== undefined ? this.state.postType : postType;
        return (
          <React.Fragment>
            <View> 
              <View style={{flexDirection: 'row', top: 80}}>
                <View style={{flex: 2}}>
                    <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={this.renderViewMore.bind(this)}
                        renderViewLess={this.renderViewLess.bind(this)}
                        //textStyle={{textAlign: 'flex-end'}}
                    >  
                      <Text>{description}</Text>
                    </ViewMoreText>
                </View>
                <View style={{flex: 1, alignItems: "flex-end"}}>
                  <ModalDropdown options={['Private', 'Public']}
                    style={styles.dropdown_2}
                    textStyle={styles.dropdown_2_text}
                    dropdownStyle={styles.dropdown_2_dropdown}
                    defaultIndex={parseInt(postTypeVal)}
                    animated={true}
                    onSelect={(idx, value) => this.changePostType(idx)}
                    //renderRow={this.renderDropDownRow()}
                  >
                  {
                    postTypeVal == 1 ? <Icon name="group" size={20} style={{color :'#CD5C5C'}}></Icon> :
                                       <Icon name="lock" size={20} style={{color :'#CD5C5C'}}></Icon>
                  }
                  </ModalDropdown>
                </View>
              </View>
              <View style={{flexDirection: 'row', top: 200}}>
                <TouchableHighlight onPress={this.handleShareButtonTouch} style={{width:100, left:40, bottom:30}}>
                  <View>
                    <Icon name="share-alt" size={30} style={{color :'#CD5C5C'}}>
                    </Icon>
                    <Text style={{'right': 8, top: 10, fontSize: 15}}>Share</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.deleteButtonConfirmation.bind(this)} style={{width:100, left:40, bottom:30}}>
                  <View>
                    <Icon name="trash" size={30} style={{color :'#CD5C5C'}}>
                    </Icon>
                    <Text style={{'right': 8, top: 10, fontSize: 15}}>Delete</Text>
                  </View>
                </TouchableHighlight> 
                
                <TouchableHighlight style={{width:100, left:40, bottom:30}}>
                  <View>
                    <Icon2 name="md-heart" size={30} style={{color :'#FC505F'}}>
                    </Icon2>
                    <Text style={{top: 10, fontSize: 15}}>{likeCount && likeCount > 0? likeCount: 0}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </React.Fragment> 
        );                        
      }

    }

    renderViewMore(onPress){
      return(
        <Text style={{left: 5, color: 'red'}} onPress={onPress}>Read more</Text>
      )
    }
    renderViewLess(onPress){
        return(
            <Text style={{left: 5, color: 'red'}} onPress={onPress}>Read less</Text>
        )
    }
    async changePostType(val) {
      var token_val = await AsyncStorage.getItem('@user_auth:token')
      await axios.put('http://70.51.251.63:3000/post/type/'+token_val+'/'+postID, {
        post_type: val
      }, { crossDomain: true }).then((response) => {
        this.setState({postType: val});
      }, (error) => {
    //    console.log(error);
      });
    } 

    renderDropDownRow(rowData, rowID, highlighted) {
      return (
        <TouchableHighlight underlayColor='cornflowerblue'>
          <View style={styles.dropdownrow}>
            <View style={styles.dropdownrowicon}>
              <Icon name="md-lock" color={'#000'}  size={17}/> 
            </View>
            <View>
              <Text style={styles.dropdownrowtext}>${rowData}</Text>
            </View>
          </View>
        </TouchableHighlight>
      )

    }

    toggleNumberOfLines() {
    //  console.log("inside toggle number of lines here ==", this.state.textShown);
      this.setState({
        textShown: !this.state.textShown,
      });
    //  console.log("final value here ==", this.state.textShown);
    };

    deleteButtonConfirmation() {
      Alert.alert(
          'Are you sure about deleting this post?',
          '',
          [
            {text: 'No', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
            //{text: 'Yes', onPress: () => this.handleDeleteButtonTouch()},
            {text: 'Yes', onPress: () => this.handleDeletePost()},
          ]
        ); 
    }

    handleDeletePost = async() => {
    //  console.log("inside handle delete post here ==", postID);
      var token_val = await AsyncStorage.getItem('@user_auth:token')
      await axios.delete('http://70.51.251.63:3000/post/'+postID+'/'+token_val, {  
        crossDomain: true
      }).then((response) => {
    //    console.log("inside success value hereee");
        this.props.navigation.replace('AccountsMainPage');
        this.props.navigation.navigate('AccountsMainPage');
        //this.props.navigation.pop(); 
      }, (error) => {
    //    console.log(error);
      });
      
    }

    handleDeleteButtonTouch = async () => {
      var path = videoSource, currentUserID = firebase.auth().currentUser.uid;
      var saved_value = '';
      try {
        saved_value = await AsyncStorage.getItem('@jm_video_urls:key');
      } catch (error) {
        // Error retrieving data
      }
      saved_value = JSON.parse(saved_value);
      //const filteredItems = items.slice(0, i).concat(items.slice(i + 1, items.length))
      saved_value[currentUserID] = saved_value[currentUserID].slice(0, videoIndex).concat(saved_value[currentUserID].slice(videoIndex + 1, saved_value[currentUserID].length));
      try {
        await AsyncStorage.setItem('@jm_video_urls:key', JSON.stringify(saved_value));
      } catch (error) {
    //    console.log(error);
      }  
      this.props.navigation.replace('CreatedVideosList');
      this.props.navigation.navigate('CreatedVideosList', { 'from': 'edit-delete'}); 
    }

    onPressedOut() {
    //  console.log('inside pressed out heree');
    /*  this.setState({
        recording: true,
        recordingText: 'Recording ...'
      }); */
    /*  Animated.loop(
        Animated.timing(this.state.opacityValue, {
            toValue: 0,
            useNativeDriver: Platform.OS === 'android',
        })).start(() => {
            this.state.scaleValue.setValue(0.01);
            this.state.opacityValue.setValue(this.state.maxOpacity);
        });  */
    //  console.log('inside on pressed out hereeeeeeeeeeeeeeeeeeeeee');  
      this.handleRecordButtonTouch(1);  // 1 means record button
    }

    async redo() {
    //  console.log("insiide redo function ")
      this.handleRecordButtonTouch(2); // 2 means redo button
    }
    handleShareButtonTouch = () => {
      if (firebase.auth().currentUser) {
        this.sharingVideo();
      } else {
        alert('Please Login Before Sharing your videos');  
      }   
    }

    sharingVideo = () => {
      let filePath = null;
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.DocumentDir + '/MashDub.mp4';
      const configOptions = {
        fileCache: true,
        path: PictureDir
      };
    
      RNFetchBlob.config(configOptions)
      .fetch('GET', videoSource)
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
    }

    _playAudioVideo() {
    //  console.log('inside play audio video going on ----------------------- ==', result);
    //  console.log("from value coming here iss ==", from);
      //this.setState({recordedEnded: false, spinner: false, startAudioRecord: false});
      this.props.navigation.navigate('DubmashVideo', {'video_url': videoSource, 'audio': result, 'audio_player': audioRecorderPlayer, 'nFrom': from});
      //this.setState({recordedEnded: false, spinner: false}, () => {
      //  console.log('sftere set the state value gereeeeeeeee');
      //}); 
    }

    _onBlur() {
    //  console.log('inside this.on blur eventssss blur()blur()blur()blur()blur()blur()blur()blur() ==', this.state.recording);
      this.setState({paused: true, muted: true, playAudioVideo: false});
      if (this.state.recording == true) {
    //    console.log('ig recording true hereeeeee');
        audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
      }   
    }

    headerListIcon(from) {
      if (from =="list" || from == "social") {
      //  console.log("11 pop menu here");
        return(
         // <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.navigate('CreatedVideosList')}/> 
         //this.props.navigation.pop();
          <Icon name='arrow-left' size={20} color="#101010" onPress={() => this.props.navigation.pop()}/>
        );
      } else {
        return(
          <Icon name='arrow-left' size={20} color="#101010" onPress={() => this.props.navigation.pop()}/> 
        );
      }
    }

    renderProgressBar() {
      return (
        <View style={[styles.controls]}>
          <TouchableWithoutFeedback onPress={this.handleMainButtonTouch} disabled={!this.state.recording ? false : true}>
            <Icon name={!this.state.paused ? "pause" : "play"} size={15} color="#000000" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleProgressPress} disabled={!this.state.recording ? false : true}>
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
      );  
    }

    render() {
      const { width } = Dimensions.get("window");
      const height = width * 0.5625;
      const { navigation } = this.props; 
      const video_url = navigation.getParam('video_url');
      videoSource = video_url;
    //  console.log('videoSource is ==', videoSource);
      const loaded = navigation.getParam('loaded');
      from = navigation.getParam('from');
      var likeCount = 0;
    //  console.log("video Index value here is ==", videoIndex)
      if (from == 'list' && !videoIndex) {
    //  console.log("crossed if condition here");
        videoIndex = navigation.getParam('index');
      }
      likeCount = navigation.getParam('likeCount');
      postID = navigation.getParam('postID');
      postType = navigation.getParam('postType');
      description = navigation.getParam('desc');
    
      var that= this;
      if (this.state.firstTime) {
      //  alert(this.state.muted.toString() + "dsnakdas");
      }
      const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) * (Dimensions.get('window') - 56 * 12);
        return (
            <Container style={{backgroundColor: '#FFFFFF'}}>
              <NavigationEvents
                //onWillFocus={payload => console.log('will focus 44444444444444444444444444444444',payload)}
                //onDidFocus={payload => console.log('did focus 55555555555555555555555555555555555',payload)}
                //onWillBlur={payload => console.log('will blur 55555555555555555555555555555555555',payload)}
                onDidBlur={() => this._onBlur()}
              />
              <Header style={{backgroundColor: '#F2F2F2'}}>
                <Left>
                  {
                    this.headerListIcon(from)
                  }
                </Left>
                <Body>
                  <View>
                    <Title style={[styles.titleText, styles.titleTextPositioning]}></Title>
                  </View>
                </Body>
                <Right>
                </Right>
              </Header>
              <View style={styles.container}>
              <Spinner
                visible={this.state.spinner}
                textContent={'Preparing Your Video...'}
                textStyle={styles.spinnerTextStyle}
              />
              
                <Video source={{uri: `${video_url}`}}   // Can be a URL or a localfile.
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
                  ignoreSilentSwitch={"ignore"}
                  muted={this.state.muted}
                  //muted={false}
                />

                { this.renderProgressBar() }
                { this.renderEditActionButtons(from, likeCount) }   

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.viewBarWrapper}
                      onPress={this.onStatusPress}
                    >
                      <View style={styles.viewBar}>
                        <View style={[
                          styles.viewBarPlay,
                          { width: 50 },
                        ]}/>
                      </View>
                    </TouchableOpacity>
                </View>

            </View>  
          </Container>  
        );
    }  
  }


  const recorder_style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 200,
      backgroundColor: '#0000FF'
    },
    titleTxt: {
      marginTop: 100 * 1,
      color: 'white',
      fontSize: 28 * 1,
    },
    viewRecorder: {
      marginTop: 40 * 1,
      width: '100%',
      alignItems: 'center',
    },
    recordBtnWrapper: {
      flexDirection: 'row',
    },
    viewPlayer: {
      marginTop: 60 * 1,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    viewBarWrapper: {
      marginTop: 28 * 1,
      marginHorizontal: 28 * 1,
      alignSelf: 'stretch',
    },
    viewBar: {
      backgroundColor: '#ccc',
      height: 4 * 1,
      alignSelf: 'stretch',
    },
    viewBarPlay: {
      backgroundColor: 'white',
      height: 4 * 1,
      width: 5,
    },
    playStatusTxt: {
      marginTop: 8 * 1,
      color: '#ccc',
    },
    playBtnWrapper: {
      flexDirection: 'row',
      marginTop: 40 * 1,
    },
    btn: {
      borderColor: 'white',
      borderWidth: 1 * 1,
    },
    txt: {
      color: 'white',
      fontSize: 14 * 1,
      marginHorizontal: 8 * 1,
      marginVertical: 4 * 1,
    },
    txtRecordCounter: {
      marginTop: 32 * 1,
      color: 'white',
      fontSize: 20 * 1,
      textAlignVertical: 'center',
      fontWeight: '200',
      fontFamily: 'Helvetica Neue',
      letterSpacing: 3,
    },
    txtCounter: {
      marginTop: 12 * 1,
      color: 'white',
      fontSize: 20 * 1,
      textAlignVertical: 'center',
      fontWeight: '200',
      fontFamily: 'Helvetica Neue',
      letterSpacing: 3,
    },
    submit:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:20,
      paddingBottom:20,
      backgroundColor:'#68a0cf',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff'
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF'
      // backgroundColor: '#F5FCFF',
    //  padding: 30,
    //  marginTop: 3,
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
      //backgroundColor: "rgba(0, 0, 0, 0.5)",
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
      marginBottom: 280
    },
    mainButton: {
      marginRight: 15,
    },
    duration: {
      //color: "#FFF",
      color: "#000000",
      marginLeft: 15,
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#101010',
      left: 135,
  //      backgroundColor: 'yellow', 
      alignSelf: 'flex-start'
    },   
    titleTextPositioning: {
      position: 'absolute'
    },
    toggledOn: {
      color: 'rgba(255, 33, 33, 1)',
      fontSize: 16,
      transform: [{
        rotate: '8deg',
      }, {
        translateY: -20,
      }],
    },   
    errorTextStyle: {
      fontSize: 18,
      alignSelf: 'center',
      color: 'red'
    },
    statusTextStyle: {
      fontSize: 18,
      color: '#FA3E44',
      alignSelf: 'center'
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
    dropdown_2: {
      //alignSelf: 'flex-end',
      //width: 150,
      //marginTop: 32,
      //right: 8,
      borderWidth: 0,
      borderRadius: 3,
      backgroundColor: 'white',
    },
    dropdown_2_text: {
      marginVertical: 10,
      marginHorizontal: 6,
      fontSize: 18,
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
      width: 150,
      height: 300,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 3,
    },
    dropdownrow:{
      flex: 1,
      flexDirection: 'row',
      margin: 7,
    },
    dropdownrowtext:{
      fontSize: 14,
      paddingLeft: 10,
    }
  });
  




  /*

      Old play pause stop buttom code

      <View style={{flexDirection: 'row', marginTop: 320}}>                  
                    <Button
                      title="Record"
                      color="#FF0000"
                      accessibilityLabel="Learn more about this purple button"
                      style={recorder_style.submit}
                      onPress={this.handleRecordButtonTouch}
                    />

                    <Button
                      title="Stop"
                      color="#841584"
                      accessibilityLabel="Learn more about this purpl button"
                      onPress={this.onStopRecord}                
      />

      <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Button
                      title="Play"
                      color="#841584"
                      accessibilityLabel="Learn more about this purple button"
                      onPress={this._playAudioVideo.bind(this)}
                    />
      </View> 

  */