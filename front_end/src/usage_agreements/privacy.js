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
import PrivacyText from "./privacy_text";

export default class privacy extends Component {  
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
                    <ScrollView>
                        {this.renderComponent()}
                    </ScrollView>
                </View> 
            </Container>            
        );
    }

    renderComponent() {
        return (
            <View>
                <Text style={{paddingTop: 25, fontWeight: "bold"}}>Privacy Agreement</Text>
                <View>
                    <PrivacyText/>
                </View>
            </View>
        )
    }

    headerListIcon() {
        return(
           // <Icon name='arrow-left' size={20} color="#FFF" onPress={() => this.props.navigation.navigate('CreatedVideosList')}/> 
           //this.props.navigation.pop();
            <Icon name='arrow-left' size={20} color='#101010' onPress={() => this.props.navigation.pop()}/>
        );
    }
}    

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        left: 135,
  //      backgroundColor: 'yellow', 
        alignSelf: 'flex-start'
    },   
});    