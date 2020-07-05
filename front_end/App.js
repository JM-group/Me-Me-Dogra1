/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {Platform, StyleSheet, Text, View, Linking, Button, Alert, Image, NativeModules } from 'react-native';
import home from "./src/home/index";
import editor from "./src/editor/index";
import AppNavigator from "./src/appnavigator";
import {
  createStackNavigator,
  createBottomTabNavigator, StackNavigator, StackActions, createAppContainer
} from "react-navigation";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';  
import React, { Component } from "react";
import { MenuProvider } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';  
import RNCameraRoll from 'react-native-cameraroll'
import ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import { Container, Header, Content, Accordion } from "native-base";
import { ApolloProvider} from 'react-apollo';
import { InMemoryCache, HttpLink } from 'apollo-client-preset';
import ApolloClient from "apollo-boost";
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const AppContainer = createAppContainer(AppNavigator);

const config = {
  apiKey: "AIzaSyB30GwZVGmkk2TV1KaEEn8HUISQjQHZcXQ",
  authDomain: "mashdub-authenticator.firebaseapp.com",
  databaseURL: "https://mashdub-authenticator.firebaseio.com",
  projectId: "mashdub-authenticator",
  storageBucket: "mashdub-authenticator.appspot.com",
  messagingSenderId: "81681520547"
};

const client = new ApolloClient({
  //uri: 'http://70.51.251.63:3000/graphql'
  //uri: 'http://70.51.251.63:3000/graphql'
  uri: 'http://70.51.251.63:3000/graphql'
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: 'fdsfdsfds'};
  }
  conponentWillMount() {
    console.log("component did moutn function hereee going on too");
    let video = "file:///Users/mohamedashif/Library/Developer/CoreSimulator/Devices/D180637B-4465-4077-B0F6-A33DE8D77FD6/data/Containers/Data/Application/5F1EAB0F-6B2C-413E-A5D1-2AA3941296EC/tmp/05BEE95B-B652-4A7E-8EFE-B92A73B1FAB3.MOV";
    let audio = "file:///Users/mohamedashif/Library/Developer/CoreSimulator/Devices/D180637B-4465-4077-B0F6-A33DE8D77FD6/data/Containers/Data/Application/5F1EAB0F-6B2C-413E-A5D1-2AA3941296EC/tmp/sound.m4a";    
   /* if (jsfirebase.apps.length == 0) {
     jsfirebase.initializeApp(config);
    } */
    firebase.auth().onAuthStateChanged(user => {
      console.log('inside on authhhhh state chabgeeeeeeeeeeeeeeeeeee');
      console.log(user);
      this.setState({ user});
    }) 
  }

  componentDidMount() {
    console.log('inside component oid mount here');
    
  }

  render() {
      console.log("startinggg herrrreeeeeeeeeeeee");
      console.log("///////////////////////////////////////////////////////////////////////////////////////////////////");
      console.log(config);
      console.log(client); 
      firebase.initializeApp(config);     
      console.log(firebase.auth());
      console.log(firebase.auth().currentUser);
      NativeModules.MashDubVideoPrep.doThis();
      NativeModules.MashDubVideoPrep.download("myFile.jpg", function(error, response) {
        let downloadedPath = response.destinationPath;
        console.log("Success!", downloadedPath);
      }); 
    /*  NativeModules.MashDubVideoPrep.mergeFilesWithUrl(video, audio, function(error, response) {
        console.log("insideeeeeeeeeeee");
        console.log(response);
      });   */
    return( 
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <AppContainer/> 
        </ApolloHooksProvider>
      </ApolloProvider>  
    );
  }
}

// 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
});

