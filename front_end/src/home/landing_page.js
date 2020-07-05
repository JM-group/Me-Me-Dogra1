import {
    createStackNavigator,
    createBottomTabNavigator,
    StackActions, NavigationActions
  } from "react-navigation"; 
  import React, { Component } from "react";
  import {Platform, StyleSheet, Image, Text, View, Linking, Button, TouchableWithoutFeedback, Dimensions, ScrollView, ListView, TouchableHighlight} from 'react-native';
  import { ListItem, FlatList } from 'react-native-elements';
  import Video from 'react-native-video';
  import VideoControls from 'react-native-video-controls';
  import ProgressBar from 'react-native-progress/Bar'
  import Icon from "react-native-vector-icons/FontAwesome"
  import Icon2 from 'react-native-vector-icons/Ionicons';  
  import Row from './row_comp';
  import Masonry from 'react-native-masonry-layout';
  import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage, CardItem } from 'react-native-material-cards';
  import firebase from 'firebase';
  import { Container, Content, Header, Title, Body, Right, Left } from 'native-base';
  import { FloatingAction } from "react-native-floating-action";
  import ActionButton from 'react-native-action-button';
  import { TouchableOpacity } from "react-native-gesture-handler";

  export default class landing_page extends Component {  
    constructor() {
      super();
      this.state = {video: '', loaded: false};
    }

    componentDidMount() {
      console.log('component did ounth inside hereee');
      /*firebase.auth().onAuthStateChanged((user) => {
        console.log('7776666666666777666666666677766666666667776666666666');
        if (user) {
          this.setState({ loaded: true })
        } else {
          this.setState({ loaded: false })
        }
      })  */
    }

    _getVideos() {
        console.log('inside get videos value hereeeee');
        const options = { 
          noData: true,
          mediaType: 'video',
          durationLimit: 30,
          allowsEditing: true
        };
        var ImagePicker = require('react-native-image-picker');
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
              //this.setState({video: response});
              //console.log(this.props.navigation.dangerouslyGetParent());
              //alert(JSON.stringify(response));
              this.props.navigation.navigate('EditorScreen', { 'video_url': response.uri, 'loaded': false, 'from': 'home'});
            }
        });
    }

    render() {
      console.log('inside landing page render fn heree');
      console.log(firebase.auth());
      console.log(firebase.auth().currentUser);
      return (
        <Container style={{backgroundColor: '#FFFFFF'}}>
            <Header style={{backgroundColor: '#F2F2F2'}}>
                <Left>
                    <TouchableOpacity>
                        <Image 
                            style={{width: 35, height: 35}} 
                            //source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}
                            source={require('../images/meme.png')}
                        >
                        </Image>
                    </TouchableOpacity>    
                </Left>                 
                <Body>
                    <Title style={[styles.titleText, {left: 30}]}>Me-Me</Title>
                </Body>
                <Right>
                </Right>
            </Header>
          
            <View style={styles.container}>
              {this.renderComponent()}
            </View> 
        </Container>
      ); 
    }  

    renderComponent() {
          return (
            <View>
              <View style={{paddingTop: 20, alignItems: 'center', justifyContent: 'center'}} >
                  <TouchableHighlight style={[styles.button, styles.addbtngrd]} onPress={() => { this._getVideos()}}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon2
                              name="md-images" color={'#ffffff'}
                              size={25}
                              style={styles.btnIcon}
                          />                        
                          <Text style={styles.addbtnrowtext}> Import from Gallery </Text>
                      </View>
                  </TouchableHighlight>
              </View>
              <View style={{paddingTop: 20, alignItems: 'center', justifyContent: 'center'}} >
                  <TouchableHighlight style={[styles.button, , styles.addbtngrd]} onPress={() => this.props.navigation.navigate('RecorderScreen')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon2
                              name='ios-videocam' color={'#ffffff'}
                              size={25}
                              style={styles.btnIcon}
                          />                        
                          <Text style={[{left: 15},styles.addbtnrowtext]}> Capture Video </Text>
                      </View>
                  </TouchableHighlight>
              </View>
            </View>  
          );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#FA3E44',
    //    backgroundColor: '#CD5C5C',
        padding: 10
    },
    countContainer: {
      alignItems: 'center',
      padding: 10
    },
    countText: {
      color: '#FF00FF'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        //color: '#101010',
        color: '#101010',
        left: 120,
  //      backgroundColor: 'yellow', 
        alignSelf: 'flex-start',
        //fontFamily: 'Cochin-BoldItalic'
    },   
    ImageIconStyle: {
        //padding: 10,
       // margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    }, 
    btnIcon: {
        height: 25,
        width: 25,
        
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
    addbtnrow:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addbtnrowtext:{
      fontSize: 17,
      color: '#ffffff',
      width: 170,
      marginLeft: 15,
      
    },
    addbtngrd:{
      height: 40,
      width: 275,
      //textAlign: 'center',
      borderRadius: 100,
    },
    addbtnrowicon:{
      padding: 9,
      marginTop: 1.5,
    },
    addbtn:{
      marginBottom: 18,
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
      flexDirection: 'row',
      padding: 100,
      margin: 2,
      borderColor: '#2a4944',
      borderWidth: 1,
      backgroundColor: 'white'
    },
  });