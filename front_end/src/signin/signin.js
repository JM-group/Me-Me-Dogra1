import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert, TouchableOpacity, ActivityIndicator, Modal, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
//import firebase from 'react-native-firebase';
var { FBLogin, FBLoginManager } = require('react-native-facebook-login');
import OAuthManager from 'react-native-oauth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content, Header, Title, Body, Right } from 'native-base';
import { NavigationActions } from 'react-navigation';
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons'; 
import user_agr_index from '../usage_agreements/index.js';

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    console.log("endeddddddddddddd00");
    //this._loadValue();
    this.state = { email: '', password: '', editing: false, error: '', errorAlert: '',
                  logged_in: false, spinner: false, progressText: "", modalVisible: false, forgot_email: ''};
    this.afterSignOut = false;
    const manager = new OAuthManager('mashtub');
    manager.configure({
      google: {
        //callback_url: `io.fullstack.FirestackExample:/oauth2redirect`,
        callback_url: 'http://127.0.0.1:8081',
        client_id: '81681520547-l54lf3ev2esrk4nljrf4j31us54f2l5v.apps.googleusercontent.com'
//        client_secret: 'YOUR_SECRET'
      }
    });
    console.log(manager);
    /*manager.authorize('google', {scopes: 'email+profile'})
    .then(resp => console.log(resp))
    .catch(err => console.log(err));  */
  }

  _loadValue = async () => { 
    console.log('inside load cvalueeeeeeeeeeee');
    try {
      console.log("inside try block heree going onnnnnnnnnnnnnnnnn");
      var saved_value = await AsyncStorage.getItem('@jm_video_urls:key');
      console.log("after getting values hereeeeeeeeeeeeee");
      console.log(saved_value);
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  } 

 // _pressSignOut() {
  _pressSignOut = async () => {
    console.log('inside press sign out hereee');
    console.log(firebase.auth());
    console.log(firebase.auth().currentUser);
    console.log(firebase.auth().currentUser.providerData);
    console.log(firebase.auth().currentUser.providerData[0].providerId);
    this.setState({
      spinner: true
    }); 
    if (firebase.auth() && firebase.auth().currentUser) {
      if (firebase.auth().currentUser.providerData[0].providerId == "facebook.com") {
        console.log('inside facebook');
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
          console.log('if condition check inside hereeeeeeee');
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
      console.log('after sign out doneee');
      
      console.log('3333444444');
    } 
    console.log('before navigate after logout');
    console.log(this.props.navigation);
    this.afterSignOut = true;
    //this.props.navigation.replace('SigninForm');
    console.log('111111');
    //this.props.navigation.navigate('SigninForm');
    console.log('after reload here');
  }

  async signOutRedirect() {
    console.log('inside signout redirect here');
    console.log(this.state.logged_in);
    console.log('after signout redirect ....');
    try {
      AsyncStorage.removeItem('@user_auth:token');
    }
      catch(exception) { 
    } 
    this.setState({logged_in: false, spinner: false});
    console.log(this.state.logged_in);
    this.props.navigation.replace('SigninForm');
    this.props.navigation.navigate('SigninForm');
  }

  async googlelogin(){
    console.log('after entering google login');
    console.log(this.state.spinner);
    this.setState({
      spinner: true, progressText: 'Google Authentication in progress'
    }); 
    try {
        // add any configuration settings here:
        await GoogleSignin.configure();
    
        const data = await GoogleSignin.signIn();
        console.log("gooogggllleee signin dataaaa");
        console.log(data)
        // create a new firebase credential with the token
        var credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
        console.log(credential);
        // login with credential
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        /* this.setState({
          spinner: !this.state.spinner
        }); */
        
        console.log(this.state.logged_in);
        this.onLoginSuccess('Successfully logged in');
        //this.props.navigation.navigate('HomeScreen');
        console.log('after alert hereeeeeeee GS');
        //this.props.navigation.pop();
      } catch (error) {
        console.log("error value coming here issss");
        console.log(error);
        console.log("------------");
        console.log(error.code)
        this.setState({progressText: ''})
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("inside error.code value hereee going onn there");
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log("inside 222222222 error.code 222222222");
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log("inside 3333333333 errorrr.code 333333333");
          // play services not available or outdated
        } else {
          console.log("inside 44444444444 errorrr.code 444444444");
          // some other error happened
        }
      }
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  onClickRegister() {
    console.log('inside one  clikccccc registerrrr gffnnnnn');
    this.props.navigation.navigate('SignupForm');
  }

  onClickForgotPassword() {
    console.log('forgot passworddddddddddd');
    //this.setState({modalVisible: visible});
    this.setState(state => {
      return {
        modalVisible: !state.modalVisible
      };
    });
    if (this.state.modalVisible == true) {
      console.log('modal visible true function hereeee');

    }
  }

  sendForgotPasswordLink() {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (expression.test(String(this.state.forgot_email).toLowerCase())) {
      firebase.auth().sendPasswordResetEmail(this.state.forgot_email)
        .then(function (user) {
          alert('Please check your email...')
      }).catch(function (e) {
          console.log(e)
      })
      this.setState({modalVisible: false});
    } else {
      this.setState({errorAlert: "Please enter valid email"});
    }
  }

  settingsIconClick() {
    console.log('inside settings icon click hereeeeee');
    this.props.navigation.navigate('UserAgrIndex');
  }

  render() {
    if (firebase.auth().currentUser) {
    //  firebase.auth().signOut();
    }
    var that = this, check = "abbbaaa", from = this.props.navigation.getParam('from');
    console.log(this.afterSignOut);
    console.log(this.state.logged_in);
    //              //onPress={() => firebase.auth().signOut()}>
    console.log(firebase.auth());
    console.log("((((((((())))))))");
    console.log(firebase.auth().currentUser);
    
    
    if (firebase.auth().currentUser) {
      console.log('888888888888888888888888888888888888888888888888888888888888888888888888888888888');
      console.log(firebase.auth().currentUser.displayName);
    }
    if (firebase.auth().currentUser) {
      console.log(firebase.auth().currentUser.isAnonymous);
      console.log(this.afterSignOut);
    }
    return (
        <Container style={{backgroundColor: '#FFFFFF'}}>
            <Header style={{backgroundColor: '#F2F2F2'}}>
                <Body>
                <Title style={styles.titleText}>Signin</Title>
                </Body>
                <Right>
                  <View>
                    <Icon onPress={()=> this.settingsIconClick()} style={[{color: 'black'}]} size={25} name={'ios-settings'}/>                    
                  </View>
                </Right>
            </Header>        
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={{marginTop: 40}}>
                <View>
                  <Title style={styles.titleTextPopup}>Forgot password</Title>
                  <View style={{top:50, alignSelf: "center", justifyContent: "center"}}>
                      <Text>Enter your email address</Text>
                  </View>
                  <View style={{top: 70}}>
                    <View style={styles.modalInputContainer}>
                      <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
                      <TextInput style={styles.inputs}
                          placeholder="Enter Your Email Address" 
                          keyboardType="email-address"
                          underlineColorAndroid='transparent'
                          value={this.state.forgot_email}
                          autoFocus={true}
                          onChangeText={(forgot_email) => this.setState({forgot_email})}/>
                    </View>  
                    
                    <View style={{alignSelf: "center", justifyContent: "center"}}>
                      <Text style={{color: 'red'}}>{this.state.errorAlert}</Text>
                    </View>

                    <View style={{flexDirection: 'row', top: 20}}>
                      <TouchableHighlight style={[styles.secondaryButton, {left: 35}]} onPress={() => this.setState({modalVisible: false})}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableHighlight>

                      <TouchableHighlight style={[styles.primaryButton, {left: 55}]} onPress={() => this.sendForgotPasswordLink()}>
                        <Text style={styles.previewpostbtntext}>Send Link</Text>
                      </TouchableHighlight>    
                    </View>  

                  </View>
                </View>
              </View>
            </Modal>
            <View style={styles.container}>
              <View>
                <Image
                    style={{width: 90, height: 90, left: 110, top: 10}}
                    source={require('../images/meme.png')}
                  />
                  <Text style={[styles.logotext, {left: 85, top: 10}]}>Login to your account</Text>

                  <Text style={[styles.errorTextStyle, {top: 13, fontSize: 14}]}>
                    {this.state.error}
                  </Text>

                  <View style={[styles.inputfeild, {top: 30}]}>
                    {this.state.email.length <= 0 ? <Icon name="md-person" color={'#A4A4A4'} style={{marginRight: 'auto'}} size={18}/>: <Text></Text>}
                    <TextInput
                        placeholder="Email" 
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                        style={styles.input}
                    />
                  </View>

                  <View style={[styles.inputfeild, {top: 30}]}>
                    {this.state.password.length <= 0 ? <Icon name="md-lock" color={'#A4A4A4'} style={{marginRight: 'auto'}} size={18}/>: <Text></Text>}
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password})}
                        style={styles.input}
                    />
                  </View>
              </View>

              <TouchableHighlight style={[styles.primaryButton, {top: 40}]} onPress={this.onButtonPress.bind(this)}>
                <Text style={styles.previewpostbtntext}>Login</Text>
              </TouchableHighlight>

              <Text style={[styles.orconticon, {top: 30}]}></Text>

              <View style={{top: 12}}>  
                  <TouchableOpacity style={[styles.GooglePlusStyle]} activeOpacity={0.5} onPress={()=>this.googlelogin()}>
                    <Image
                      //We are showing the Image from online
                      source={{
                        uri:
                          'https://cdn3.iconfinder.com/data/icons/google-suits-1/32/1_google_search_logo_engine_service_suits-512.png',
                      }}
                      //You can also show the image from you project directory like below
                      //source={require('./Images/google-plus.png')}
                      //Image Style
                      style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Continue with Google </Text>
                  </TouchableOpacity>  

                  <FBLogin style={{ marginBottom: 10, left: 10}}
                    ref={(fbLogin) => { this.fbLogin = fbLogin }}
                    permissions={["email","user_friends"]}
                    loginBehavior={FBLoginManager.LoginBehaviors.Native}
                    onLogin={function(data){
                      console.log("inside on login function hereeee");
                      FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
                      const credential = firebase.auth.FacebookAuthProvider.credential(data.credentials.token)
                      const fireBaseAuth = firebase.auth().signInWithCredential(credential);
                      that.onLoginSuccess('Successfully logged in');
                    }}  
                    onLogout={function(){
                      console.log("Logged out.");
                    }}
                    onLoginFound={function(data){
                      console.log("Existing login found.");
                      console.log(data);
                      console.log(data.credentials);
                    }}
                    onLoginNotFound={function(){
                      console.log("No user logged in.");
                    }}
                    onError={function(data){
                      console.log("ERROR");
                      console.log(data);
                    }}
                    onCancel={function(data){
                      console.log("User cancelled.");
                      console.log(data);
                    }}
                    onPermissionsMissing={function(data){
                      console.log("Check permissions!");
                      console.log(data);
                      console.log(firebase.auth().currentUser);
                    }}
                  />
              </View>

              <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickForgotPassword()}>
                  <Text>Forgot your password ?</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickRegister()}>
                  <Text>Register</Text>
              </TouchableHighlight>
 
              <Text style={styles.progressTextStyle}>
                {this.state.progressText}
              </Text>

            </View>
      </Container>  
      );  
  }

  onButtonPress = async () => {
    console.log('inside on button presss heeerrrrreeeeeeeeeee');
    this.setState({progressText: 'Authenticating ..'});
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
    console.log(firebase.auth());
    console.log(firebase.auth().currentUser);
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch((errorMsg) => {
        this.onLoginFailure.bind(this)(errorMsg)
    });
  } 

  onSignUp() {
    console.log('inside on sign up methd hereeeeeeeeeeeeerrr');
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(this.onLoginSuccess.bind(this)(message))
        .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
      });
  }
 
//  onLoginSuccess(message) {
  onLoginSuccess = async (message) => {
    console.log('inside login success');
    //this._setLoginReference(message.user.uid);
    console.log(this.state.logged_in);
    console.log("((((((((())))))))");
    console.log(firebase.auth().currentUser);
    console.log(this.props.navigation.getParam('from'));
    this.setState({logged_in: true, spinner: false, progressText: ''});
    console.log('after login success set value here');
    console.log(this.state.logged_in);
    //this.props.navigation.navigate('HomeScreen');
    var token = '', ajaxStatus = false;

      await axios.post('http://70.51.251.63:3000/login', {
              "email": firebase.auth().currentUser.email,
              "ph_number": firebase.auth().currentUser.phoneNumber,
              "profile_pic": firebase.auth().currentUser.photoURL,
              "display_name": firebase.auth().currentUser.displayName,
      }, {crossDomain: true}).then((response) => {
            ajaxStatus = true;
            console.log(response.data.user_data_object.tokens);
            console.log(response.data.user_data_object.tokens.length);
            console.log(response.data.user_data_object.tokens[response.data.user_data_object.tokens.length - 1]);
            token = response.data.user_data_object.tokens[response.data.user_data_object.tokens.length - 1].token;
      }, (error) => {
            ajaxStatus = false;
      });

    console.log('before signin setttttttttt valueeeeeee going on thereeeeeeee isssssssssss');
    try {
      AsyncStorage.removeItem('@user_auth:token');
    }
      catch(exception) { 
    } 

    console.log(token);

    if (ajaxStatus) {
      console.log('inside iffff condition hereeee');
      await AsyncStorage.setItem('@user_auth:token', token);
      console.log('inside iffff conditioonnn after settt valuee here');
    } 

    try {
      console.log('inside try block to check get timeee');
      var check_get_val = await AsyncStorage.getItem('@user_auth:token');
      console.log(check_get_val);
    } catch (error) {
      console.log('inside catch error value going onnnnnn');
      console.log(error);
    }
    alert("Login Successful");    
    if (this.props.navigation.getParam('from') == 1) {
      console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii == ');
      this.props.navigation.pop();
    } else {
      console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj == ');
      this.props.navigation.navigate('AccountsMainPage');
    }  
  }

  onLoginFailure(errorMessage) {
    console.log('inside login failure class hereeee');
    console.log(errorMessage);
    if (errorMessage.message) {
      this.setState({ error: errorMessage.message, loading: false, progressText: '' })
    } else {
      this.setState({ error: errorMessage, loading: false, progressText: '' })
    }
  }
  
  _setLoginReference = async (uid) => {
    console.log(uid);
    console.log('Insiude login reference here going onnnnnnnn112222333344445555555555');
    var saved_value = null;
    /*try {
      console.log("inside try block heree going onnnnnnnnnnnnnnnnn");
      saved_value = await AsyncStorage.getItem('@user_auth:key');
      console.log("after getting values hereeeeeeeeeeeeee ");
      console.log(saved_value);
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
    if (saved_value == null) {
      try {
        await AsyncStorage.setItem('@user_auth:key', uid);
      } catch (error) {
        console.log(error);
      }   
    } */
  } 

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#DCDCDC',
    backgroundColor: '#FFFFFF'
  },
  container2: {
    flex: 1,
    backgroundColor: '#DCDCDC',
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
  logotext:{
    //paddingBottom: 20,
    top: 2,
    right: 15,
    fontSize: 14,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  inputfeild:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    height: 52,
    width: 300,
    borderRadius: 50,
    marginBottom: 10,
    padding: 19,  
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
   socialsigninicon:{
    width: 40,
    height: 40,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  orconticon:{
    paddingTop: 30,
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
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 30,
    width: 135,
    height: 40,
    top: 10
  },
});















/*
<Container>

<ImageBackground style={styles.centercontainer} source={(this.state.userdata && this.state.userdata.cover) ? {uri:this.state.userdata.cover} : loginbgm}>
    <View style={{backgroundColor:'rgba(0,0,0,0.5)',width:'100%',height:'100%',flexDirection:'row'}}>
        <View style={{flex:1,alignSelf:'flex-end',padding:10,justifyContent:'center'}}>
            <Image source={(this.state.userdata && this.state.userdata.profile) ? {uri:this.state.userdata.profile} : require('../../sharedassets/icons/profile/user.png')} style={{height:105,borderRadius:55}}></Image>
        </View>
        <View style={{flex:1.8,alignSelf:'flex-end',justifyContent:'center'}}>
            <View style={{flexDirection:'row',alignSelf:'flex-end',padding:20,justifyContent:'center'}} key="ButtonsLvl1">

                {
                    this.isauthed()
                }
            </View>
        </View>
    </View>
</ImageBackground>
<View style={{flex:2}} key="BottomContainer">

        <ListItem icon noIndent noBorder style={styles.listitm} onPress={()=>this.gotoDownloaded()}>
            <Left>
                    <Image source={require('../../sharedassets/icons/profile/download.png')}></Image>
            </Left>
            <Body>
                <Text style={{fontFamily:global_styles.globalTextRegular.fontFamily}}>Downloaded Content</Text>
            </Body>
        </ListItem>
        <View
            style={{
                borderBottomColor: '#8a8a8a',
                borderBottomWidth: 0.5,
            }}
        />
        <ListItem icon noIndent noBorder style={styles.listitm} onPress={() => this.props.navigation.push('UserSettings')} >
            <Left>
                    <Image source={require('../../sharedassets/icons/profile/settings.png')}></Image>
            </Left>
            <Body>
                <Text style={{fontFamily:global_styles.globalTextRegular.fontFamily}}>Settings</Text>
            </Body>
        </ListItem>
        <ListItem icon noIndent noBorder style={styles.listitm} onPress={() => this.props.navigation.push('FAQ')}>
            <Left>
                    <Image source={require('../../sharedassets/icons/profile/help.png')}></Image>
            </Left>
            <Body>
                <Text style={{fontFamily:global_styles.globalTextRegular.fontFamily}}>Help / FAQ</Text>
            </Body>
        </ListItem>
        <ListItem icon noIndent noBorder style={styles.listitm} onPress={() => Linking.openURL('market://details?id=com.fiestago')}>
            <Left>
                    <Image source={require('../../sharedassets/icons/profile/rate.png')}></Image>
            </Left>
            <Body>
                <Text style={{fontFamily:global_styles.globalTextRegular.fontFamily}}>Rate Us</Text>
            </Body>
        </ListItem>
        <ListItem icon noIndent noBorder style={styles.listitm} onPress={()=>this.props.navigation.push('AboutUs')}>
            <Left>
                    <Image source={require('../../sharedassets/icons/profile/about.png')}></Image>
            </Left>
            <Body>
                <Text style={{fontFamily:global_styles.globalTextRegular.fontFamily}}>About Us</Text>
            </Body>
        </ListItem>
        <ListItem icon noIndent noBorder style={styles.listitm} onPress={()=>this.shareapp()}>
            <Left>
                    <Image source={require('../../sharedassets/icons/profile/share.png')}></Image>
            </Left>
            <Body>
                <Text style={{fontFamily:global_styles.globalTextRegular.fontFamily}}>Share Us</Text>
            </Body>
        </ListItem>
</View>
</Container>


*/