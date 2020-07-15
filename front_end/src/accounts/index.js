import {
  createStackNavigator,
  createBottomTabNavigator, NavigationEvents
} from "react-navigation";
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image, ScrollView,
  Alert, TouchableOpacity, ActivityIndicator, Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
//import firebase from 'react-native-firebase';
var { FBLogin, FBLoginManager } = require('react-native-facebook-login');
import OAuthManager from 'react-native-oauth';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content, Header, Title, Body, Right } from 'native-base';
//import { NavigationActions } from 'react-navigation';
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons'; 
import Icon2 from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
  
export default class accounts extends Component {  
    constructor() {
        super();
        this.state = { loading: true,
                      no_video_saved: true,
                      file_deleted: false,
                      user: null, firstName: '', lastName: '', photoUrl: '', postedVideos: []
                    };
    }
    
    componentWillMount() {
      this.loadUserData();
    }

    componentDidMount() {
      this._getData();
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
              this.setState({no_video_saved: false, loading: false});
          }    
      } else {   
          this.setState({ loading: false, no_video_saved: true });
      }    
    }
    
    async loadUserData() {
      var token_val = await AsyncStorage.getItem('@user_auth:token');
      //await axios.get('http://70.51.251.63/user/'+token_val, {
      await axios.get('http://70.51.251.63:3000/user/post/'+token_val, {
        crossDomain: true
      }).then((response) => {
            this.setState({
               firstName: response.data.first_name,
               lastName: response.data.last_name,
               photoUrl: response.data.profile_pic,
               postedVideos: response.data.postVal
            })
        }, (error) => {
          console.log(error);
        });  
    }

    render() {
      //  console.log(this.state.photoUrl.length);
        var displayName = '', that = this;
        if (firebase.auth().currentUser && firebase.auth().currentUser != null && firebase.auth().currentUser.displayName.length < 10) {
          displayName = firebase.auth().currentUser.displayName;
        }
        if (!this.saved_videos) {
          this.saved_videos = [];
        }
        return (
          <Container style={{backgroundColor: '#FFFFFF'}}>
              <Header style={{backgroundColor: 'white'}}>
                  <Body>
                  <Title style={styles.titleText}>Profile</Title>
                  </Body>
                  <Right>
                    <View>
                      <Icon onPress={()=> this.settingsIconClick()} style={[{color: 'black'}]} size={25} name={'ios-settings'}/>                    
                    </View>
                  </Right>
              </Header>
              <NavigationEvents
                onDidFocus={() => this.loadUserData()}
              />
              <View style={styles.container2}>
                  <View style={{height: 160}}>
                    <TouchableHighlight onPress={()=>this.loadImages()} 
                      style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:100,
                        height:100,
                        backgroundColor:'#fff',
                        borderRadius:50,
                        top: 15,
                        justifyContent: 'center',
                        alignSelf: 'center'
                      }}
                    > 
                    {
                      this.loadProfilePic()
                    }  
                    </TouchableHighlight>   
                  </View>   

                  <View style={[styles.profilerowbutton, {left: 40}]}>      
                    <View>
                      <TouchableHighlight style={[styles.secondaryButton, {justifyContent: 'center', alignSelf: 'center'}]} onPress={() => this._pressSignOut()}>
                        <Text style={styles.logOutButtonText}>Logout</Text>
                      </TouchableHighlight>  
                    </View>                         
                    <View style={{left: 20}}>
                      <TouchableHighlight style={[styles.primaryButton, {justifyContent: 'center', alignSelf: 'center'}]} onPress={() => this.loadProfileData()}>
                        <Text style={styles.previewpostbtntext}>View Profile</Text>
                      </TouchableHighlight>  
                    </View>
                  </View>  

                  <View style={[styles.postdubtitle, this.state.postedVideos.length > 3 ? {top: 50} : {top: -10}]} onPress={() => alert('hi hi hi 45678')}>
                      <Text style={{fontWeight: 'bold'}}>Posted videos</Text>
                  </View>
                  <ScrollView>
                  <View style={[styles.recentpostvideos, {top: 60}]} onPress={() => alert('hi hi hi 123')}>     
                        {
                          this.state.postedVideos.map(function(video_url, index) {
                              var videoVal = 'http://70.51.251.63:3000/' + video_url.post_media[0], description = video_url.description,
                              likeCount = video_url.likes_count && video_url.likes_count > 0? video_url.likes_count: 0;
                              return (
                                <View style={styles.recentpostvideosrow} key={index} onPress={() => console.log("touch two here")}>
                                  <TouchableHighlight 
                                  onPress={() => that.props.navigation.navigate('EditorScreen', { 'video_url': videoVal, 'loaded': true, 'from': 'list', 'postType': video_url.post_type, 'index': index, 'likeCount': likeCount, postID: video_url._id, 'desc': video_url.description})}>  
                                    <Video
                                      source={{ uri: 'http://70.51.251.63:3000/' + video_url.post_media[0] }}
                                      muted={true}
                                      resizeMode="cover"
                                      paused={true}
                                      style={styles.recentpostvideosrowvideo}
                                      onPress={() => console.log("just touch here")}
                                    />
                                  </TouchableHighlight>  
                                  <View style={styles.profilepostvideoicon}>
                                      <View style={styles.profileposthearticon}>
                                          <Icon name="md-heart" size={15} color="#FC505F" />
                                      </View>

                                      <Text style={styles.postvideoliketext}>{likeCount}</Text>
                                  </View>
                                </View>  
                              );    
                          })  
                        }   
                  </View>  
                  <View>
                    {this.state.postedVideos.length <= 0 ? <Text style={{flexDirection: 'row', alignSelf: 'center'}}>No Videos Posted Yet</Text>: <Text></Text>}
                  </View>
                  <View style={{paddingBottom: 30}}>

                  </View>
                  </ScrollView> 
                  
                </View>
          </Container>     
      );
    }       

    loadProfilePic() {
      if(this.state.photoUrl && this.state.photoUrl.length > 0) {
          return (
              <Image style={styles.avatar} source={{uri: "http://70.51.251.63:3000/" + this.state.photoUrl}}></Image>
          )
      } else {
          return (
              <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}></Image>
          )
      }
    }

    settingsIconClick() {
      this.props.navigation.navigate('UserAgrIndex');
    }

    loadImages() {
    //      console.log("load images here going onnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
      var options = {
          title: 'Select Image',
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }
      };

      ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
          if (response.didCancel) {
            console.log('User cancelled image picker');
          }else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }else {
            console.log('User selected a file form camera or gallery', response); 
            const data = new FormData();
            //data.append('name', 'avatar');
            //data.append('file', response);
            console.log(response);
            data.append('file', {
              uri : response.uri,
              type: response.type,
              name: response.fileName
            });
            console.log("response.uri value here isss ==", response.uri);
            const config = {
              method: 'POST',
              headers: {
               'Accept': 'application/json',
               'Content-Type': 'multipart/form-data',
              },
              file: data,
            };
            this.setState({photoUrl: response.uri});
            this.saveProfilePic(data);
          }
      }); 
    }

    async saveProfilePic(config) {
      console.log("inside async save profile pic value going on hereeeee");
      var token_val = await AsyncStorage.getItem('@user_auth:token');
      //await axios.post('http://70.51.251.63/upload_profile_pic/'+token_val, config, {
      await axios.post('http://70.51.251.63:3000/upload_profile_pic/'+token_val, config, {  
        crossDomain: true
      }).then((response) => {
            console.log(response);
        }, (error) => {
          console.log(error);
       });

    }

    loadProfileData() {
      this.props.navigation.navigate('UserProfileData');
    }

    pressEditDetails() {
      this.props.navigation.navigate('EditAccDetailsPage');
    }

    _pressSignOut = async () => {
        this.setState({
          spinner: true
        }); 
        var token_val = await AsyncStorage.getItem('@user_auth:token');        
        if (firebase.auth() && firebase.auth().currentUser) {
          if (firebase.auth().currentUser.providerData[0].providerId == "facebook.com") {
            firebase.auth().signOut().then(this.signOutRedirect.bind(this))
            .catch((errorMsg) => {console.log('inside error message here');});  
            FBLoginManager.logout(function(error, data){
              if (!error) {
                  console.log('inside ! error going on hereee');
              } else {
                console.log(error, data);
              }
            });
          } else {
            firebase.auth().signOut().then(this.signOutRedirect.bind(this))
            .catch((errorMsg) => {console.log('inside error message here');});    
            console.log('inside else for signout');
            const isSignedIn = await GoogleSignin.isSignedIn();
            console.log(isSignedIn);
            if (isSignedIn) {
              try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                console.log('after signout');
                this.setState({ user: null }); // Remember to remove the user from your app's state as well
              } catch (error) {
                console.log('inside error');
                console.error(error);
              }
            }
          }
        } 
        
        //await axios.post('http://70.51.251.63/logout/'+token_val, {
        
        await axios.post('http://70.51.251.63:3000/logout/'+token_val, {  
        }, {
          crossDomain: true
        }).then((response) => {
              console.log(response);
        }, (error) => {
          console.log(error);
        });

       
        this.afterSignOut = true;
        //this.props.navigation.replace('SigninForm');
    }
    
    async signOutRedirect() {
        try {
          AsyncStorage.removeItem('@user_auth:token');
        }
          catch(exception) { 
        } 
        //this.props.navigation.replace('SigninForm');
        this.props.navigation.navigate('SigninForm');
        alert("Succesfully Logged Out");
    }

}
  
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        },
        container2: {
          flex: 1,
          backgroundColor: '#FFFFFF'
        },
        errorTextStyle: {
            fontSize: 18,
            alignSelf: 'center',
            color: 'red'
        },
        progressTextStyle: {
            fontSize: 22,
            alignSelf: 'center',
            color: 'green'
        },
        inputContainer: {
            borderBottomColor: '#F5FCFF',
            backgroundColor: '#FFFFFF',
            borderRadius:30,
            borderBottomWidth: 1,
            width:250,
            height:45,
            marginBottom:20,
            flexDirection: 'row',
            alignItems:'center'
        },
        modalInputContainer: {
          borderBottomColor: '#F5FCFF',
          backgroundColor: '#FFFFFF',
          borderRadius:30,
          borderColor: '#CD5C5C',
          borderBottomWidth: 1,
          width:250,
          height:45,
          marginBottom:20,
          flexDirection: 'row',
          alignItems:'center'
        },
        inputs:{
          height:45,
          marginLeft:16,
          borderBottomColor: '#FFFFFF',
          flex:1,
        },
        inputIcon:{
          width:30,
          height:30,
          marginLeft:15,
          justifyContent: 'center'
        },
        buttonContainer: {
          height:45,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom:20,
          width:250,
          borderRadius:30,
        },
        modalButtonContainer: {
          height:45,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom:20,
          width:250,
          borderRadius:30,
        },
        loginButton: {
          backgroundColor: "#CD5C5C",
        },
        cancelButton: {
          backgroundColor: '#f0f0f0',
        },
        loginText: {
          color: 'white',
        },
        cancelText: { 
          color: 'black',
        }, 
        gplusbtn:{
          marginTop:10,
          backgroundColor:'#fff'
        },
        GooglePlusStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#dc4e41',
          borderWidth: 0.5,
          borderColor: '#fff',
          height: 30,
          width: 188,
          borderRadius: 5,
          margin: 5,
        },
        ImageIconStyle: {
          padding: 10,
          margin: 5,
          height: 25,
          width: 25,
          resizeMode: 'stretch',
        },
        TextStyle: {
          color: '#fff',
        //  marginBottom: 4,
        //  marginRight: 20,
        },
        SeparatorLine: {
          backgroundColor: '#fff',
          width: 1,
          height: 30,
        },
        spinnerTextStyle: {
          color: '#FFF'
        },
        titleText: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#101010',
          left: 135,
      //      backgroundColor: 'yellow', 
          alignSelf: 'flex-start'
        },  
        avatar: {
          width: 130,
          height: 130,
          borderRadius: 63,
          borderWidth: 4,
          borderColor: "white",
          //marginBottom:10,
          alignSelf:'center',
          //position: 'absolute',
          marginTop:25,
          //paddingBottom: 120
        },
        titleTextPopup: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          left: 100,
      //      backgroundColor: 'yellow', 
          alignSelf: 'flex-start'
        },
        header2:{
          backgroundColor: "#00BFFF",
          height:200,
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
        secondaryButton: {
          alignItems: 'center',
          backgroundColor: '#f2f2f2',
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
        logOutButtonText: {
          color: 'black',
          fontSize: 17
        },
        recentpostvideos:{
          //flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          //justifyContent: 'space-between',
        },
        recentpostvideosrowvideo:{
          height: 120,
          width:120,
        },
        postdubtitle:{
          marginTop: 8,
          backgroundColor: '#f2f2f2',
          alignItems: 'center',
          padding: 13,
          //position: 'fixed'
        },
        profilerowbutton:{
          flex: 1,
          flexDirection: 'row'
        },
        profileposthearticon:
        {
          padding:4,
          backgroundColor: '#fff',
          height: 20,
          width: 20,
          borderRadius: 100,
        },
        profilepostvideoicon: {
          position: 'absolute',
          right: 5,
          bottom: 5,
        
        },
        postvideoliketext: {
          color: '#fff',
          //fontWeight: 700,
        },
    });