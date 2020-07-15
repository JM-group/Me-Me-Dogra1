import {
    createStackNavigator,
    createBottomTabNavigator
} from "react-navigation";
import React, { Component } from "react";
import {Platform, StyleSheet, Text, View, Image, Linking, TouchableWithoutFeedback, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Alert} from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
//import Video from 'react-native-video';
import Video from 'react-native-af-video-player';
import VideoControls from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
//import firebase from 'react-native-firebase';
import { Container, Content, Header, Title, Body, Right } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
var RNFS = require('react-native-fs');

var no_video_saved = true;
export default class created_videos_list extends Component {  
    constructor() {
        super();
        this.state = {
            loading: true,
            no_video_saved: true,
            file_deleted: false,
            user: null
        }
    }
    
    componentDidMount() {
        this._getData();
    }

    componentWillMount() {
        console.log(firebase.auth());
        console.log(firebase.auth().currentUser);
    }

    _getData = async () => {
        let videoEmpty = false;
        var userID = firebase.auth().currentUser.uid;
        if (firebase.auth().currentUser) {
            let saved_value = [];
            try { 
                saved_value = await AsyncStorage.getItem('@jm_video_urls:key');
                if (saved_value && JSON.parse(saved_value)[userID] && JSON.parse(saved_value)[userID][0]) {
                // We have data!!
                //saved_value = JSON.parse(saved_value);
                saved_value = JSON.parse(saved_value);
                //no_video_saved = false;
                } else {
                    //  no_video_saved = true;
                    videoEmpty = true;
                    this.setState({loading: false, no_video_saved: true});
                }
            } catch (error) {
                // Error retrieving data
            }
            if (videoEmpty == false && saved_value[userID]) {
                this.saved_videos = saved_value[userID];
                console.log(this.saved_videos);
                this.setState({no_video_saved: false, loading: false});
            }    
        } else {   
            this.setState({ loading: false, no_video_saved: true });
        }    
    }

    deleteButtonConfirmation(videoIndex) {
        Alert.alert(
            'Are you sure about deleting this video?',
            '',
            [
              {text: 'No', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.handleDeleteButtonTouch(videoIndex)},
            ]
          ); 
    }

    handleDeleteButtonTouch = async (videoIndex) => {
        var saved_value = '';
        try {
            saved_value = await AsyncStorage.getItem('@jm_video_urls:key');
        } catch (error) {
            // Error retrieving data
            console.log(error);
        } 
        saved_value = JSON.parse(saved_value);
        //const filteredItems = items.slice(0, i).concat(items.slice(i + 1, items.length))
        let currentUserID = firebase.auth().currentUser.uid;
        saved_value[currentUserID] = saved_value[currentUserID].slice(0, videoIndex).concat(saved_value[currentUserID].slice(videoIndex + 1, saved_value[currentUserID].length));
        try {
            await AsyncStorage.setItem('@jm_video_urls:key', JSON.stringify(saved_value));
            this._getData();
            if (saved_value[currentUserID][0]) {
                this.setState({no_video_saved: false, fileDeleted: true});
            } else {
                this.setState({no_video_saved: true, fileDeleted: true});
            }
        } catch (error) {
            console.log(error);
        }    
     //   this.shouldComponentUpdate('delete')
    }

    handleError = (meta) => {
        const {error: {code}} = meta;
        let error = "Error occured during loafing video";
        switch (code) {
            case -118800: 
                error = "Couldnt load video from URL";
                break;
        }
    }  

    onMorePress(meta) {

    }
    
    play() {
      this.video.play()
      this.video.seekTo(25)
    }
  
    pause() {
      this.video.pause()
    }

    redirectToDetails(video_url, index) {
      this.props.navigation.navigate('EditorScreen', { 'video_url': video_url, 'loaded': true, 'from': 'list', 'index': index})  
    }

    render() {
            var from_param = this.props.navigation.getParam('from');
            if (from_param == 'edit-delete') {
                from_param = '';
                this._getData();                
            }
            //this._getData();
            if (this.saved_videos) {
                console.log(this.saved_videos['url']);  
                 
            }
            // this.setState({fileDeleted: false});
            //console.log(RNFetchBlob.fs.dirs.DocumentDir);
            const url = 'https://your-url.com/video.mp4'
            const logo = 'https://your-url.com/logo.png'
            const placeholder = 'https://your-url.com/placeholder.png'
            const title = 'My video title';
           
            const theme = {
                title: '#FFF',
                more: '#446984',
                center: '#7B8F99',
                fullscreen: '#446984',
                volume: '#A5957B',
                scrubberThumb: '#234458',
                scrubberBar: '#DBD5C7',
                seconds: '#DBD5C7',
                duration: '#DBD5C7',
                progress: '#446984',
                loading: '#DBD5C7'
            }
        
            if (this.state.loading === false && this.state.no_video_saved == false && this.saved_videos) {
                //file:///Users/sahithyarajith/Library/Developer/CoreSimulator/Devices/171E6B72-A416-47C2-B16E-1516A8B7D3F7/data/Containers/Data/Application/96225561-7D1A-4E01-B626-2C399A1FAD1B/Documents/tglx9vMK6E_jnm.mp4
                console.log(this.saved_videos);
                return (
                    <Container>
                        <Header style={{backgroundColor: '#CD5C5C'}}>
                            <Body>
                            <Title style={styles.titleText}>Video List</Title>
                            </Body>
                            <Right>
                            </Right>
                        </Header>
                        <View>
                            <ScrollView>
                                {
                                     this.saved_videos.map((video_url, index) => (
                                        <View key = {index}>
                                            <TouchableHighlight onPress={() => this.deleteButtonConfirmation(index)} style={{width:100, top:10, left: 210, flexDirection: 'row-reverse', position: 'absolute', zIndex: 30}}>
                                                <View>
                                                    <Icon name="trash" size={40} style={{color :'#CD5C5C'}}>
                                                    </Icon>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight onPress={() => this.props.navigation.navigate('EditorScreen', { 'video_url': video_url, 'loaded': true, 'from': 'list', 'index': index})} style={{width:100, top:10, left: 270, flexDirection: 'row-reverse', position: 'absolute', zIndex: 10}}>
                                                <View>
                                                    <Icon name="hand-pointer-o" size={40} style={{color :'#CD5C5C'}}>
                                                    </Icon>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight activeOpacity={1}
                                                onPress={() => this.props.navigation.navigate('EditorScreen', { 'video_url': video_url, 'loaded': true, 'from': 'list', 'index': index})}>
                                                <View>
                                                    <Video
                                                        autoPlay={false}
                                                        //onPress={() => console.log('inside hereeeeeeee 12334444555566')}
                                                        url={video_url}
                                                        logo={logo}
                                                        //placeholder={placeholder}
                                                        //theme={theme}
                                                        hideFullScreenControl={true}
                                                        volume={0}
                                                        inlineOnly={true}
                                                        lockRatio={16 / 9}
                                                    />
                                                </View>    
                                            </TouchableHighlight>                  
                                        </View>
                                    ))  
                                }
                            </ScrollView>        
                        </View>   
                    </Container>
                );
            } else if (!firebase.auth().currentUser || (this.state.loading === false && this.state.no_video_saved == true)) {
                return ( 
                    <Container>
                        <Header style={{backgroundColor: '#CD5C5C'}}>
                            <Body>
                            <Title style={styles.titleText}>Video List</Title>
                            </Body>
                            <Right>
                            </Right>
                        </Header>
                        <View>
                            <Text style={styles.container}>No videos saved</Text>
                        </View>
                    </Container>    
                );
            } else {
                return ( 
                    <Container>
                        <Header style={{backgroundColor: '#CD5C5C'}}>
                            <Body>
                            <Title style={styles.titleText}>Video List</Title>
                            </Body>
                            <Right>
                            </Right>
                        </Header>                    
                        <View>
                            <Text style={styles.container}>Loading ...</Text>
                        </View>
                    </Container>
                );
            }   
        }     
    }
  
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 30,
            marginTop: 3,
        },
        item: {
            flexDirection: 'row',
            padding: 100,
            margin: 2,
            borderColor: '#2a4944',
            borderWidth: 1,
            backgroundColor: 'white'
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            left: 135,
      //      backgroundColor: 'yellow', 
            alignSelf: 'flex-start'
        },
        duration: {
            color: "#FFF",
            marginLeft: 15,
        }
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
            position: 'absolute',
            alignItems: 'center',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            width: 400
        },
      });