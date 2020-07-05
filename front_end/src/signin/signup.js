import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import axios from "axios";
import { Container, Content, Header, Title, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    console.log("endeddddddddddddd00");
    this.state = { email: '', password: '', confirmpwd: '', error: '', displayName: ''};
  }

  onClickSignin() {
    console.log('on click signin redirect here going onnnn');
    this.props.navigation.navigate('SigninForm');
  }

  render() {
    console.log("inside render method heree going onnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");   
    console.log(firebase.auth.currentUser);
    return (
      <Container style={{backgroundColor: '#FFFFFF'}}>
        <Header style={{backgroundColor: '#F2F2F2'}}>
          <Body>
            <Title style={styles.titleText}>Signup</Title>
          </Body>
          <Right>
          </Right>
        </Header>
        <View style={styles.container}>
          <View>
            <View style={{top: 16}}>
              <Image
                  style={{width: 90, height: 90, justifyContent: 'center', alignSelf: 'center', bottom: 50}}
                  source={require('../images/meme.png')}
                />
              <Text style={[{justifyContent: 'center', textAlign: 'center', left: 5, bottom: 50}]}>Create account to continue</Text>
            </View>

          <KeyboardAvoidingView>  
            <Text style={[styles.errorTextStyle, {bottom: 25, fontSize: 14}]}>
              {this.state.error}
            </Text>
            <View style={{top: 10}}>
              <View style={[styles.inputfeild, {bottom: 30}]}>
                {this.state.email.length <= 0 ? <Icon name="md-mail" color={'#A4A4A4'}  size={18} style={{marginRight: 'auto'}}/>: <Text></Text>}
                <TextInput
                    placeholder="Email" 
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    value={this.state.email}
                    onChangeText={(email) => this.setState({email})}
                    style={styles.input}
                />
              </View>

              <View style={[styles.inputfeild, {bottom: 30}]}>
                {this.state.displayName.length <= 0 ? <Icon name="md-person" color={'#A4A4A4'} size={18} style={{marginRight: 'auto'}}/>: <Text></Text>}
                <TextInput
                    placeholder="Display Name"
                    secureTextEntry={false}
                    underlineColorAndroid='transparent'
                    value={this.state.displayName}
                    onChangeText={(displayName) => this.setState({displayName})}
                    style={styles.input}
                />
              </View> 

              <View style={[styles.inputfeild, {bottom: 30}]}>
                {this.state.password.length <= 0 ? <Icon name="md-lock" color={'#A4A4A4'}  size={18} style={{marginRight: 'auto'}}/>: <Text></Text>}
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    style={styles.input}
                />
              </View> 

              <View style={[styles.inputfeild, {bottom: 30}]}>
                {this.state.confirmpwd.length <= 0 ? <Icon name="md-lock" color={'#A4A4A4'}  size={18} style={{marginRight: 'auto'}}/>: <Text></Text>}
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    value={this.state.confirmpwd}
                    onChangeText={(confirmpwd) => this.setState({confirmpwd})}
                    style={styles.input}
                />
              </View> 
            </View>  

            <TouchableHighlight style={[styles.primaryButton, {bottom: 60, justifyContent: 'center', alignSelf: 'center'}]} onPress={this.onSignUp.bind(this)}>
              <Text style={styles.previewpostbtntext}>Signup</Text>
            </TouchableHighlight>

            <View style={[styles.bottomsignin, {justifyContent: 'center', alignSelf: 'center'}]}>
              <Text>Already have an account</Text>
            </View>
            <TouchableHighlight style={styles.signintext, {justifyContent: 'center', alignSelf: 'center'}} onPress={() => this.onClickSignin()}>
              <Text style={{color: '#FF2D4B'}}>Sign in</Text>
            </TouchableHighlight>
          </KeyboardAvoidingView>
          </View>

        </View>
      </Container>  
    );
  }

  /* onButtonPress() {
    console.log('inside on button presss heeerrrrreeeeeeeeeee');
    this.setState({ error: '', loading: true })
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
          });
      });
  }  */

  onSignUp() {
    console.log('inside on sign up methd hereeeeeeeeeeeeerrr');
    this.setState({ error: '', loading: true })
    const { email, password, confirmpwd } = this.state;
    console.log(email);
    console.log(password); 
    console.log(confirmpwd);
    console.log(this.state.displayName);
    console.log(this.state.displayName.trim());
    console.log(this.state.displayName.trim().length);
    if (password == confirmpwd && this.state.displayName && this.state.displayName.trim().length > 4) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(this.onSignupSuccess.bind(this))
            .catch((error) => {
                let errorCode = error.code
                let errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    this.onSignupFailure.bind(this)('Weak password!')
                } else {
                    this.onSignupFailure.bind(this)(errorMessage)
                }
        });
        this.props.navigation.navigate('HomeScreen');
    } else if (password != confirmpwd) {
      this.setState({ error: 'password and confirm passwords are not same', loading: false }); 
    } else {
      this.setState({ error: 'Please enter username with minimum 5 characters', loading: false }); 
    }
  }
 
  onSignupSuccess(userData) {
    console.log('on Signup Successss here');
    console.log(userData);
    console.log(firebase.auth())
    console.log(firebase.auth().currentUser);
    console.log(JSON.stringify(userData));
    console.log(this.state.displayName);
    if(firebase.auth().currentUser) {
      firebase.auth().currentUser.updateProfile({
        displayName: this.state.displayName,
      }).then({
      })
      firebase.auth().currentUser.sendEmailVerification();
    }
    this.setState({
      email: '', password: '', error: '', loading: false
    })
    //this._setLoginReference(userData.user.uid);
    this._setLoginReference(userData);
    this.props.navigation.navigate('HomeScreen');
  }

  onSignupFailure(errorMessage) {
    console.log('inside login failure class hereeee');
    console.log(errorMessage);
    if (errorMessage.message) {
      this.setState({ error: errorMessage.message, loading: false })
    } else {
      this.setState({ error: errorMessage, loading: false })
    }
  }
  
  _setLoginReference = async (userData) => {
    var uid = userData.user.uid
    console.log('user datat vaulue is ======================');
    console.log(userData);
    console.log(uid);
    console.log('Insiude login reference here going onnnnnnnn112222333344445555555555');
    console.log(this.state);
    var saved_value = null, displayName = this.state.displayName, token='', ajaxStatus = false;

//    await axios.post('http://70.51.251.63:3000/user', {
    await axios.post('http://70.51.251.63/user', {
        "email": userData.user.email,
        "ph_number": 16478037288,
        "auth_token": "156a",
        "refresh_token": "5679",
        "display_name": displayName,
        "first_name": "Mohamed",
        "last_name": "12355Ashif",
        "gender": "Male",
        "age": 22,
       "profile_pic": 'dummy url value'
    }, {crossDomain: true}).then((response) => {
      console.log(response);
      console.log(response.data);
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);      
      ajaxStatus = true;
      console.log(response.data.user_data_object);
      token = response.data.user_data_object.tokens;
    }, (error) => {
      console.log("iiiiiiiiiiii inside error vallll ueee =");
      console.log(error);
      ajaxStatus = false;
    });
    
    console.log('ajax status is == ', ajaxStatus);

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

    try {
      console.log("inside try block heree going onnnnnnnnnnnnnnnnn");
      saved_value = await AsyncStorage.getItem('@user_auth:key');
      console.log("after getting values hereeeeeeeeeeeeee");
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
    }
  } 

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  errorTextStyle: {
      fontSize: 18,
      alignSelf: 'center',
      color: 'red'
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
  loginButton: {
    backgroundColor: "#CD5C5C",
  },
  loginText: {
    color: 'white',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101010',
    left: 135,
//      backgroundColor: 'yellow', 
    alignSelf: 'flex-start'
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
  bottomsignin:{
    paddingTop: 30,
    justifyContent: "flex-end",
  },
  signintext:{
    color: '#FF2D4B',
    alignItems: 'center',
    textAlign: 'center',
    padding: 5,
  },
});
