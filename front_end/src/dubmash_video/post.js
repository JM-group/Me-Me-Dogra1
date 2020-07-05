import {
    createStackNavigator,
    createBottomTabNavigator
  } from "react-navigation";
  import React, { Component } from 'react';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
  import {Platform, StyleSheet, Text, View, Linking, Image, TouchableWithoutFeedback, KeyboardAvoidingView, 
    Dimensions, TouchableOpacity, Modal, TouchableHighlight, TextInput, Alert, ScrollView} from 'react-native';
  import { Button } from 'react-native-elements';
  import Video from 'react-native-video';
  import VideoControls from 'react-native-video-controls';
  import ProgressBar from 'react-native-progress/Bar'
  import Icon from "react-native-vector-icons/Ionicons"
  import AsyncStorage from '@react-native-community/async-storage';
  import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
  import axios from "axios";
  import firebase from 'firebase';
  import { throwStatement } from "@babel/types";

    var radio_props = [
        {label: 'Private', value: 0 },
        {label: 'Public', value: 1 }
    ];

    const createFormData = (videoUri, description) => {
        const data = new FormData();
        console.log("video uri value going in iss ==");
        console.log(videoUri);
        data.append('file', {
            name: "random.mov",
            uri: Platform.OS === 'android' ? videoUri : videoUri.replace('file://', ''),
            type: "mov"
        });
        return data;
    };

    class Post extends Component {
        constructor(props) {
            super(props);
            this.closeModal = this.closeModal.bind(this);
            this.handleSaveVideo = this.handleSaveVideo.bind(this);
            this.getStatusText = this.getStatusText.bind(this);
            this.getPostButton = this.getPostButton.bind(this);
            //this.postContent.bind(this);
            this.postData.bind(this);
            this.scrollRef = React.createRef();
        }

        state = {
            desc: '',
            visibility: 0,
            posted: 1,
            value: 0
        };

        onFocus() {
            this.scrollView.scrollToEnd({animated: true});
        }

        render() {
            var value = '';
            return (
                    <ScrollView
                        ref={ref => this.scrollView = ref}>              
                        <View style={styles.videoContainer}>
                                <Video
                                    source={{uri: `${this.props.videoURL}`}}
                                    ref={(ref) => {
                                        this._player = ref
                                    }}
                                    paused={true}
                                    resizeMode="contain"
                                    muted={true}                                      
                                    style={styles.video}
                                    onLoad={() => {
                                        this._player.seek(2);
                                    }}/>    
                                <View>
                                    <TouchableOpacity style={{top: 6, alignSelf: 'flex-end'}} onPress={() => this.closeModal()}>
                                        <Icon style={[{color: 'red'}]} size={35} name={'ios-close-circle-outline'}/>                    
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.textAreaContainer} >
                                    <TextInput
                                        style={styles.textArea}
                                        underlineColorAndroid="transparent"
                                        placeholder="Express your mind in words here"
                                        placeholderTextColor="grey"
                                        numberOfLines={10}
                                        multiline={true}
                                        onChangeText={(desc) => this.setState({desc})}
                                        value={this.state.desc}
                                        onFocus={ () => this.onFocus() }
                                    />
                                </View>
                                <View style={styles.radioButtonContainer}>
                                    <RadioForm
                                        radio_props={radio_props}
                                        initial={this.state.value}
                                        formHorizontal={true}
                                        onPress={(value) => {this.setState({value:value})}}
                                    />                         
                                </View>
                                <View style={styles.submitButtonContainer}>
                                    {this.getPostButton(this.state.posted)}
                                </View>
                                <View style={styles.statusTextContainer}>
                                    {this.getStatusText(this.state.posted)}
                                </View>
                                <View style={{ height: 300 }} />                                
                                
                                <View style={{ height: 300 }} />                                                                    
                        </View>
                    </ScrollView>    
            );
        }  
        getStatusText(posted) {
            if (posted === 2) {
                return (
                    <Text style={styles.postingStatusText}>Posting .... </Text>
                );        
            } else if (posted === 3) {
                return (
                    <Text style={styles.postedStatusText}>Posted</Text>
                );    
            }
        }
        getPostButton(posted) {
            if (posted === 1) {
                return (
                    <TouchableOpacity
                      style={[styles.primaryButton, {left: 10}]}
                      onPress={() => {this.postData(this.props.videoURL);}}
                    >
                        <Text style={styles.previewpostbtntext}> Post </Text>
                    </TouchableOpacity>
                );    
            } else if (posted === 2) {
                return (
                    <TouchableOpacity
                      style={[styles.primaryButton, {left: 10}]}
                      onPress={() => {}}
                    >
                        <Text style={styles.previewpostbtntext}> Post </Text>
                    </TouchableOpacity>
                );    
            } else if (posted === 3) {
                return (
                    <TouchableOpacity
                      style={[styles.primaryButton, {left: 10}]}
                      onPress={() => {alert("Already posted");}}
                    >
                        <Text style={styles.previewpostbtntext}> Posted </Text>
                    </TouchableOpacity>
                );    
            }     
        }
        closeModal() {
            this.props.changeState();
        }
        async handleSaveVideo() {
            this.props.saveVideo('post', this.postContent.bind(this));
        }
        async postData(videoURL) {
            var token_val = await AsyncStorage.getItem('@user_auth:token');
            if (token_val) {
                if (this.state.posted == 2) {
                    alert("please wait until post finish");   
                }  else {  
                    this.setState({posted: 2});  
                    await this.handleSaveVideo();    
                    //this.setState({posted: 1});
                }    
            } else {
                alert("Please login to save your videos");
            }    
        }
        async postContent() {
            console.log("inside post content here going onn hereee 111112222233333");
            var token_val = await AsyncStorage.getItem('@user_auth:token'), that = this, postJson = {};
            var savedValue = await AsyncStorage.getItem('@jm_video_urls:key');
            var userID = firebase.auth().currentUser.uid;
            var userVideos = JSON.parse(savedValue)[userID];
            var savedVideoURL = userVideos[userVideos.length - 1];
            //const formData = createFormData(videoURL, this.state.value);  
            console.log("before appending formdata value here issss // ===", this.state.value); 
            const formData = createFormData(savedVideoURL, this.state.value);
            const config = {
                method: 'POST',
                headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'multipart/form-data',
                },
                file: formData,
                //desc: {"desc": this.state.value}
            };
            console.log("final response here isss");
            console.log(formData);
            await axios.post('http://70.51.251.63:3000/postMedia/'+token_val, formData, {
            }).then((response) => {
                console.log("coming under response here going onnnn");
                console.log(response);
                postJson['path'] = response.data.path;
                postJson['description'] = that.state.desc;
                postJson['post_type'] = that.state.value;
                console.log("post json value going here issssss");
                console.log(postJson);
                axios.post('http://70.51.251.63:3000/post/'+token_val,  postJson, {
                    //crossDomain: true
                }).then((response) => {
                    console.log("after receiving response value here isssssss");
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
            //return 1;
            this.setState({posted: 3});
            alert("Successfully posted");
        }
    }
  
  
  export default Post;
  
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20
        },
        modal: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#2196f3',
            justifyContent: 'center',
            padding : 10,
        },
        text: {
            color: '#fff',
            fontSize: 20,
            textAlign: 'center',
        },
        touchableButton: {
            width: '70%',
            padding: 10,
            backgroundColor: '#f06292',
            marginBottom: 10,
            marginTop: 30,
        },
        videoContainer: {
            flex: 1,
            backgroundColor: 'white',
        },
        video: {
            position: 'absolute',
            top: 20,
            bottom: 400,
            left: 0,
            right: 0,
            width: "100%",
            height: 250
        },
        textAreaContainer: {
            //borderColor: 'grey',
            //borderWidth: 1,
            padding: 5,
            top: 220
        },
        textArea: {
            //padding: 10,
            height: 150,
            justifyContent: "flex-start",
            backgroundColor: '#f2f2f2',
            borderColor: 'white', 
            borderWidth: 0.2,  
            //marginBottom: 20
        },
        radioButtonContainer: {
            top: 250,
            left: 100,
            zIndex: 30
        },
        submitButtonContainer: {
            top: 300,
            left: 100,
            width: "50%", 
            margin: 10,
            zIndex: 30
        },
        statusTextContainer: {
            top: 220,
            left: 156        
        },
        postingStatusText: {
            fontSize: 15,
            fontWeight: 'bold',
            color: 'green',
            alignItems: 'center',
        },
        postedStatusText: {
            fontSize: 15,
            fontWeight: 'bold',
            color: 'green',
            alignItems: 'center',
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