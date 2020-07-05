import {
    createStackNavigator,
    createBottomTabNavigator, StackNavigator, StackActions, createAppContainer, NavigationActions
  } from "react-navigation";
import editor from "./editor/index";
import home from "./home/index";
import landing_page from "./home/landing_page";
import video_recorder from "./home/video_recorder";
import row_comp from"./home/row_comp";
import dubmash_video_page from "./dubmash_video/index";
import created_videos_list from "./created_videos_list/index";
import accounts from "./accounts/index";
import edit_acc_details from "./accounts/edit_acc_details";
import user_profile_data from "./accounts/user_profile_data";
import social from "./social/index";
import React, {Component} from 'react';
import {StyleSheet, Text, View,Button} from 'react-native';  
import Icon from 'react-native-vector-icons/Ionicons'; 
import signin from './signin/signin.js';
import signup from './signin/signup.js';
import user_agr_index from './usage_agreements/index';
import privacy from './usage_agreements/privacy';
import terms from './usage_agreements/terms';
import LikePage from './social/like'
import firebase from 'firebase';


const HomeStack = createStackNavigator({
  LandingScreen: { screen: landing_page, navigationOptions:{ header : null}},  
  HomeScreen: { screen: home, navigationOptions:{ header: null} },
  SocialList: { screen: social, navigationOptions:{ header: null} },
  LikePage: {screen: LikePage, navigationOptions: {header: null}},  
  EditorScreen: { screen: editor, navigationOptions:{ header: null} },
  RecorderScreen: { screen: video_recorder, navigationOptions:{header: null}},
  RowComp: { screen: row_comp },
  DubmashVideo: { screen: dubmash_video_page, navigationOptions:{ header: null} },
  SigninForm: { screen: signin, navigationOptions:{header: null}},
  CreatedVideosList: { screen: created_videos_list, navigationOptions:{ header: null} },
  SigninForm: { screen: signin, navigationOptions:{ header: null} },
  SignupForm: { screen: signup, navigationOptions:{ header: null} },
});

const CreatedVideosListStack = createStackNavigator({
  CreatedVideosList: { screen: created_videos_list, navigationOptions:{ header: null} },
  EditorScreen: { screen: editor, navigationOptions:{ header: null} },
  SigninForm: { screen: signin, navigationOptions:{header: null}},
});

const SocialStack = createStackNavigator({
  LandingScreen: { screen: landing_page, navigationOptions:{ header : null}},
  SocialList: { screen: social, navigationOptions:{ header: null} },
  LikePage: {screen: LikePage, navigationOptions: {header: null}},
  SigninForm: { screen: signin, navigationOptions:{ header: null} },
  SignupForm: { screen: signup, navigationOptions:{ header: null} },
  EditorScreen: { screen: editor, navigationOptions:{ header: null} },
  HomeScreen: { screen: home, navigationOptions:{ header: null} },
  RecorderScreen: { screen: video_recorder, navigationOptions:{header: null}},
  RowComp: { screen: row_comp },
  DubmashVideo: { screen: dubmash_video_page, navigationOptions:{ header: null} },
  CreatedVideosList: { screen: created_videos_list, navigationOptions:{ header: null} },
});

const AccountsStack = createStackNavigator({
  SigninForm: { screen: signin, navigationOptions:{ header: null} },
  SignupForm: { screen: signup, navigationOptions:{ header: null} },
  SocialList: { screen: social, navigationOptions:{ header: null} },
  AccountsMainPage: { screen: accounts, navigationOptions:{ header: null} },
  EditAccDetailsPage: {screen : edit_acc_details, navigationOptions: {header: null} },
  UserProfileData:  {screen : user_profile_data, navigationOptions: {header: null} },
  UserAgrIndex: {screen: user_agr_index, navigationOptions: {header: null}},
  Privacy: {screen: privacy, navigationOptions: {header: null}}, 
  Terms: {screen: terms, navigationOptions: {header: null}},   
  EditorScreen: { screen: editor, navigationOptions:{ header: null} },
});

const AppNavigator = createBottomTabNavigator(
    {
      Home: { screen: HomeStack, 
        navigationOptions:{  
            tabBarLabel:'  ',
            tabBarOnPress: ({navigation, defaultHandler}: any) => {
              console.log('inside tab on press function hereeee');
              console.log(navigation.state.routes);
              console.log(navigation.state);
              console.log(navigation.state.routes.length);
              console.log('before actttttttttttttttttttttttttttttttttttttttttttt');
              //navigation.replace('LandingScreen');
              //navigation.replace('SocialList');
              defaultHandler()
            },
            tabBarIcon: ({ tintColor }) => (  
              <View>  
                  <Icon style={[{color: tintColor}]} size={28} name={'ios-home'}/>  
              </View>),
              tabBarOptions: {
                activeTintColor: '#FF2D4B'
              },  
            }, 
      },
      Social: { screen: SocialStack,
        navigationOptions:{  
          tabBarLabel:'  ',
          tabBarOnPress: ({navigation, defaultHandler}: any) => {
            console.log("coming inside hereeeeeee social stack vaue hereee");
            //navigation.replace('SigninForm');
            //navigation.replace('LandingScreen');
            defaultHandler()
          },
          tabBarIcon: ({ tintColor }) => (  
            <View>  
                <Icon style={[{color: tintColor}]} size={28} name={'ios-add'}/>  
            </View>),  
            tabBarOptions: {
              activeTintColor: '#FF2D4B'
            },                 
          } 
      },  
      Accounts: { screen: AccountsStack, 
          navigationOptions:{  
            tabBarLabel:'  ',
            tabBarOnPress: ({navigation, defaultHandler}: any) => {
              console.log('inside tab on pressssssssssss');
              console.log(firebase.auth());
              console.log('///<<>>==', firebase.auth().currentUser);
              //defaultHandler();
              if (firebase.auth() && firebase.auth().currentUser) {
                console.log('ooooooooooooeeeeeeeee');
                console.log(firebase.auth().currentUser);
                navigation.replace('AccountsMainPage');
                navigation.navigate('AccountsMainPage');
              } else {
                console.log('pppppppppppppppppppppp');
                navigation.navigate('SigninForm');
                //defaultHandler()
              }
             // navigation.replace('SigninForm');
             // defaultHandler()
            },
            tabBarIcon: ({ tintColor }) => (  
              <View>  
                  <Icon style={[{color: tintColor}]} size={28} name={'md-person'}/>  
              </View>), 
              tabBarOptions: {
                  activeTintColor: '#FF2D4B'
              },      
            } 
      }
    },
    {
      initialRouteName: "Home"
    }, {
      headerMode: 'screen',
      cardStyle:{backgroundColor:'red'}
    }
  );

export default createAppContainer(AppNavigator);
