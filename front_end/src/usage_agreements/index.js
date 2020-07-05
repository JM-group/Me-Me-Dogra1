import {
    createStackNavigator,
    createBottomTabNavigator,
    StackActions, NavigationActions
  } from "react-navigation"; 
import React, { Component } from "react";
import {Platform, StyleSheet, Image, Text, View, Linking, Button, TouchableWithoutFeedback, Dimensions, ScrollView, ListView, TouchableHighlight} from 'react-native';
import { ListItem, FlatList } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Container, Content, Header, Title, Body, Right, Left } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";

export default class user_agr_index extends Component {  
    constructor() {
        super();
        this.state = {video: '', loaded: false};
    }

    render() {
        return (
            <Container style={{backgroundColor: '#FFFFFF'}}>
                <Header style={{backgroundColor: '#F2F2F2'}}>
                    <Left>
                        {this.headerListIcon()} 
                    </Left>
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
                <Text style={{paddingTop: 20}}>Inside User Agreement Index</Text>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                    <Text style={styles.textStyle} onPress={ ()=> this.props.navigation.navigate('Terms') }>Terms & Conditions</Text>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                    <Text style={styles.textStyle} onPress={ ()=> this.props.navigation.navigate('Privacy') }>Privacy</Text>                    
                </View>
            </View>
        )
    }

    headerListIcon() {
        return(
           // <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.navigate('CreatedVideosList')}/> 
           //this.props.navigation.pop();
            <Icon name='arrow-left' size={20} color="black" onPress={() => this.props.navigation.pop()}/>
        );
      }
}    

/*
    headerListIcon(from) {
      console.log('inside header icon here ==', from);
      if (from =="list") {
        return(
         // <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.navigate('CreatedVideosList')}/> 
         //this.props.navigation.pop();
          <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.pop()}/>
        );
      } else {
        return(
          <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.navigate('HomeScreen')}/> 
        );
      }
    }
*/

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent: 'center',
      paddingHorizontal: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#101010',
        left: 135,
  //      backgroundColor: 'yellow', 
        alignSelf: 'flex-start'
    },  
    textStyle: {
 
        color: '#E91E63',
        textDecorationLine: 'underline'
    }
     
});    