import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert, TouchableOpacity, ActivityIndicator, Modal, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import firebase from 'react-native-firebase';
import { Container, Content, Header, Title, Body, Right, Left } from 'native-base';
import { NavigationActions, NavigationEvents, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import firebase from 'firebase';
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

var from = 'details';

export default class userProfileData extends Component {  
    constructor() {
        super();
        var displayName = '';
        if (firebase.auth().currentUser && firebase.auth().currentUser.displayName.length <= 9) {
          displayName = firebase.auth().currentUser.displayName;
        } else {
          displayName = '';
        }
        this.state = { displayName: displayName, successMsg: '', error: '', firstName: '', lastName: '', profilePic: undefined, dateOfBirth: ''};
    }

    componentWillMount() {
      this.loadUserData();
    }

    async loadUserData() {
      var token_val = await AsyncStorage.getItem('@user_auth:token');
      //crossDomain: true
      //await axios.get('http://70.51.251.63/user/'+token_val, {crossDomain: true}).then((response) => {
      await axios.get('http://70.51.251.63:3000/user/'+token_val, {crossDomain: true}).then((response) => {
          this.setState({
              firstName: response.data.first_name,
              lastName: response.data.last_name,
              photoUrl: response.data.profile_pic,
              //dateOfBirth: response.data.dob ? Moment(this.state.dateOfBirth).format('d-MM-YYYY').toString() : '01-01-2000',
              dateOfBirth: response.data.dob,
              country: response.data.country,
              email: response.data.email,
              displayName: this.state.displayName ? this.state.displayName : response.data.display_name,
              countryCode: this.state.country_code
          })
      }, (error) => {
        console.log(error);
      });  
    }

    headerListIcon() {
      if (from == 'dubmash') {  
        return(
          // <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.navigate('CreatedVideosList')}/> 
          //this.props.navigation.pop();
            <Icon name='arrow-left' size={20} color="black" onPress={() => { this.props.navigation.pop()}}/>
          );
        } else {
          return(
              <Icon name='arrow-left' size={20} color="black" onPress={() => { 
                this.props.navigation.replace('AccountsMainPage'); 
                this.props.navigation.navigate('AccountsMainPage');
              }}/>
            );  
        }    
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

    render() {
        from = this.props.navigation.getParam('from');
        var dob = undefined;
        //"/Users/admin/Desktop/social_media/" + 
        if (this.state.photoUrl) {
            console.log(this.state.photoUrl.length)
        }
        //console.log(this.state.photoUrl.length);
        if (this.state.dateOfBirth) {
          dob = new Date(this.state.dateOfBirth);
          console.log(dob.getDate() + "-" + dob.getMonth() + "-" + dob.getFullYear())
         // console.log(Moment(this.state.dateOfBirth).format('d MM YYYY'))
         // console.log(Moment(this.state.dateOfBirth).format('d-MM-YYYY').toString())
        }
        return (
                <Container style={{backgroundColor: '#FFFFFF'}}>
                    <Header style={{backgroundColor: 'white'}}>
                        <Left>
                          {this.headerListIcon(from)} 
                        </Left>
                        <Body>
                        <Title style={[styles.titleText, {color: "black"}]}></Title>
                        </Body>
                        <Right>
                          <Icon name='pencil' size={20} color="black" onPress={() => { this.props.navigation.navigate('EditAccDetailsPage')}}/>
                        </Right>
                    </Header>
                    <NavigationEvents
                      onDidFocus={() => this.loadUserData()}
                    />
                    <ScrollView>
                        <View style={styles.container2}>
                        {
                            this.loadProfilePic()
                        }    
                            <View style={{flexDirection: "row", paddingTop: 10, paddingLeft: 80}}>  
                              <Icon name='user-o' size={20} color="black" style={{right: 35, top: 12}}/>
                              <TextInput style={[styles.inputs, {right: 10}]} autoCapitalize={"none"}
                                  placeholder="Display Name" 
                                  //keyboardType="email-address"
                                  underlineColorAndroid='transparent'
                                  value={this.state.displayName}
                                  editable={false}
                                  onChangeText={(displayName) => this.setState({displayName})} maxLength={9} autoFocus/>
                            </View>
                            <View style={{flexDirection: "row", paddingTop: 10, paddingLeft: 80}}>  
                              <Icon name='envelope-o' size={20} color="black" style={{right: 35, top: 12}}/>
                              <TextInput style={[styles.inputs, {right: 10}]}
                                  placeholder="Email" 
                                  //keyboardType="email-address"
                                  underlineColorAndroid='transparent'
                                  value={this.state.email}
                                  editable={false}
                                  onChangeText={(email) => this.setState({email})} maxLength={30}/>
                            </View>
                            <View style={{flexDirection: "row", paddingTop: 10, paddingLeft: 80}}>  
                              <Icon name='user-circle' size={20} color="black" style={{right: 35, top: 12}}/>
                              <TextInput style={[styles.inputs, {right: 10}]}
                                  placeholder="First Name" 
                                  //keyboardType="email-address"
                                  underlineColorAndroid='transparent'
                                  value={this.state.firstName}
                                  editable={false}
                                  onChangeText={(firstName) => this.setState({firstName})} maxLength={30}/>
                            </View>
                            <View style={{flexDirection: "row", paddingTop: 10, paddingLeft: 80}}>   
                              <Icon name='user-circle' size={20} color="black" style={{right: 35, top: 12}}/>
                              <TextInput style={[styles.inputs, {right: 10}]}
                                  placeholder="Last Name" 
                                  //keyboardType="email-address"
                                  underlineColorAndroid='transparent'
                                  value={this.state.lastName}
                                  editable={false}
                                  onChangeText={(lastName) => this.setState({lastName})} maxLength={30}/>
                            </View>
                            <View pointerEvents="none" style={{flexDirection: "row", paddingTop: 10, paddingLeft: 80}}>   
                              <Icon name='calendar' size={20} color="black" style={{right: 35, top: 12}}/>
                              <DatePicker
                                style={{width: 200}}
                                //value={this.state.dateOfBirth}
                                //date="3-02-1940" //initial date from state
                                date = {dob ? dob.getDate() + "-" + ( dob.getMonth() + 1)  + "-" + dob.getFullYear(): ''}
                                mode="date" //The enum of date, datetime and time
                                placeholder="Enter D.O.B"
                                format="DD-MM-YYYY"
                                minDate="01-01-1940"
                                maxDate="01-01-2012"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    left: 10,
                                    top: 4,
                                    marginLeft: 0,
                                    width: 0, height: 0
                                  },
                                  dateInput: {
                                    //marginRight: 30,
                                    //right: 5,
                                    right: 55,
                                    borderColor: 'white'
                                  }
                                }}
                                onDateChange={(dateOfBirth) => {this.setState({dateOfBirth: dateOfBirth})}}
                              />
                            </View>
                            <View style={{flexDirection: "row", paddingTop: 10, paddingLeft: 80}}>   
                              <Icon name='map' size={20} color="black" style={{right: 35, top: 12}}/>
                              <TextInput style={[styles.inputs, {right: 10}]}
                                  placeholder="Country" 
                                  //keyboardType="email-address"
                                  underlineColorAndroid='transparent'
                                  editable={false}
                                  value={this.state.country}
                                  onChangeText={(country) => this.setState({country})} maxLength={30}
                              />
                            </View>
                            <Text style={styles.errorTextStyle}>
                              {this.state.error}
                            </Text> 
                            <Text style={styles.successTextStyle}>
                              {this.state.successMsg}
                            </Text> 
                        </View>
                    </ScrollView>    
                </Container>     
        );
    }     

    saveAccDetails() {
      firebase.auth().currentUser.updateProfile({
        displayName: this.state.displayName,
      }).then(
        this.afterSavingAccDetails.bind(this)        
      )  
    }

    afterSavingAccDetails = async() => {
      var token_val = await AsyncStorage.getItem('@user_auth:token');
      
      //await axios.put('http://70.51.251.63/user/'+token_val, {
      await axios.put('http://70.51.251.63:3000/user/'+token_val, {  
              "display_name": this.state.displayName,
              "first_name": this.state.firstName,
              "last_name": this.state.lastName
      }, {crossDomain: true}).then((response) => {
            console.log(response);
      }, (error) => {
        console.log(error);
      });  
      this.setState({successMsg: 'Successfully saved ...'});
      if (from == 'dubmash') {
        this.props.navigation.pop();
      } else {
        this.props.navigation.replace('AccountsMainPage');
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
        container2: {
          flex: 1,
          backgroundColor: '#FFFFFF'
        },
        textInputStyle: {
          margin: 15,
          height: 40,
          borderColor: '#7a42f4',
          borderWidth: 1,
          paddingLeft: 10,
          backgroundColor: 'white'
        },
        errorTextStyle: {
            fontSize: 18,
            alignSelf: 'center',
            color: 'red'
        },
        successTextStyle: {
          fontSize: 18,
          alignSelf: 'center',
          color: 'green',
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
          borderColor: '#7a42f4',
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
          color: 'white',
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
    });