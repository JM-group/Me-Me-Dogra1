import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, Linking, Button, Image, TouchableWithoutFeedback, Dimensions, TouchableOpacity, TouchableHighlight} from 'react-native';
import Video from 'react-native-video';
import VideoControls from 'react-native-video-controls';
import ProgressBar from 'react-native-progress/Bar'
import Icon from "react-native-vector-icons/FontAwesome"


const styles = StyleSheet.create({
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
      position: 'absolute',
      alignItems: 'center',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      width: 400
  },
});

function pressRow(post) {
  const { navigate } = post;
  navigate('EditorScreen');
}


//{`${props.name.first} ${props.name.last}`}
//<Image source={{ uri: props.picture.large}} style={styles.photo} />
const Row = (prop, navigation) => (
  <TouchableHighlight
        onPress={() =>  this.props.navigation.navigate('EditorScreen')}
      >
      <Video source={{uri: `${prop.video_url}`}}   // Can be a URL or a localfile.
            ref={(ref) => {
              this.player = ref
            }}     
            muted={true}                                 // Store reference
            onBuffer={this.onBuffer}                // Callback when remote video is buffering
            onError={this.videoError}               // Callback when video cannot be loaded
            resizeMode="contain"
            style={styles.video}/>  
  </TouchableHighlight>            
 
);



export default Row;
