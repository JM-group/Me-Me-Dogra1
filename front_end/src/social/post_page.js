import {
    createStackNavigator,
    createBottomTabNavigator
} from "react-navigation";
import React, { Component, Fragment } from "react";
import {Platform, StyleSheet, Text, View, Linking, Button, TouchableWithoutFeedback, FlatList, Alert, TouchableOpacity, TouchableHighlight, Dimensions, ScrollView} from 'react-native';
import { Container, Content, Header, Title, Body, Right } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
//import Video from 'react-native-video';
import Video from 'react-native-af-video-player';
import VideoControls from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import axios from "axios";
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks'
import { responsePathAsArray } from "graphql";

const theme = {
    title: '#FFF',
    more: '#446984',
    center: '#7B8F99',
    fullscreen: '#446984',
    volume: '#A5957B',
    scrubberThumb: '#234458',
    scrubberBar: '#DBD5C7',
    seconds: '#DBD5C7',
    duration: '#DBD5C7',
    progress: '#446984',
    loading: '#DBD5C7',
    backgroundColor: '#FFF'
}


const FEED_DATA = gql`
        query FeedData($after: String!, $move: String!, $token: String!) {
            feeds_data(_id: "123", after: $after, first: "1", move: $move, token: $token) {
                _id
                description
                post_media
                updatedAt
                likes_count
                has_next_page_flag
                has_prev_page_flag
                cursor
                user_liked
                posted_user_prof_pic
                posted_user_email
                user_id
            }
        }    
`;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
//    console.log("inside is close to bottm hereeee");
//    console.log("layout measurement.height =="+ layoutMeasurement.height + " ... content offser value ==", contentOffset.y);
//    console.log(contentSize.height);
//    console.log(contentSize);
//    console.log(layoutMeasurement.height + contentOffset.y >= contentSize.height - 50)
    //return layoutMeasurement.height + contentOffset.y >=
      //contentSize.height - 50;
    return contentOffset.y > 60; 
};
  
const ifCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    //console.log("content offset value here iss ==");
    //console.log(contentOffset);
    return contentOffset.y == 0;
};

var no_video_saved = true;
export default class PostListPage extends Component {  
    constructor(props) {
        super();
        const { widgets } = props;
        this.state = { props }
        this.onEndReachedCalledDuringMomentum = true;
        this.fetchingData = false;
        this.token_val = '';
        this.user_liked = false;
        this.likesCount = 0;
    }

   
    componentWillMount() {
        this.loadUserToken();
    }

    async loadUserToken() {
        this.token_val = await AsyncStorage.getItem('@user_auth:token');
    }

    mySeparator = () => (
        <View
            style={{
                height: 1,
                width: '100%',
                backgroundColor: "#CED0CE"
            }}
        />
    );
    render() {
        const url = 'https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Video2.mp4'
        //const url = 'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DB7CB7CB-76D8-4F52-9DB7-E0D31D86DA4A/data/Containers/Data/Application/0AA145EF-EFA0-4F03-BB4A-9AD23F942827/Documents/e3PK5V7pb2_jnm.mp4'
        const logo = 'https://your-url.com/logo.png'
        const placeholder = 'https://your-url.com/placeholder.png'
        const title = 'My video title';
        console.log("inside post page page page page post post page page post");
        //console.log(this.saved_videos);
        console.log("here here hereee");
        console.log(this.state);
        console.log(this.state.props);
            return (             
                    <FlatList
                        //refreshing={loading}
                        data={this.state.props.widgets.feeds_data}
                        ItemSeparatorComponent={this.mySeparator}
                        renderItem={({item}) => {
                            //console.log("inside render item value going on heree");
                            //console.log(this.state);
                            //this.setState({fetchingData: false});
                            this.fetchingData = false;
                        return (
                        <Fragment>
                            <View key = {item._id} style={{paddingTop: 20}}>    
                                <View style={styles.iconContainer}>                                          
                                        
                                        { this.renderThumbsUp(item._id, item.user_liked, this.state.user_liked) }
                                        { this.renderLikeCount(item.likes_count) }    
                                        <Text>{this.state.user_liked} sdjnsadn</Text>                                                
                                </View>

                                    <Video
                                        autoPlay
                                        //url="https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Video2.mp4"
                                        url={"/Users/admin/Desktop/social_media/" + item.post_media[0] + ".mov"}
                                        theme={theme}
                                        //hideFullScreenControl={true}
                                        volume={0}
                                        //inlineOnly={true}
                                        logo={logo}
                                        lockRatio={8 / 9}
                                        scrollBounce={true}
                                        onMorePress={() => this.onMorePress()} 
                                        //fullScreenOnly
                                     />

                                <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between", height: 100
                                            }}>  
                                    <View style={{flex: 3}}>    
                                        <Text>{item.description}</Text>
                                    </View>  
                                    <View style={{flex: 1}}>    
                                        <Text>{"Icon"}</Text>
                                    </View>   
                                </View>
                            </View>

                            <View style={{paddingTop: 30}}>
                                {item.has_next_page_flag ? 
                                    <Button onPress={() => {
                                        fetchMore({
                                            query: FEED_DATA,
                                            variables:{"after": item._id, move: "2"},
                                            updateQuery: (prev, {fetchMoreResult}) => {
                                            if (!fetchMoreResult) return prev;
                                                return fetchMoreResult;
                                            }
                                        })
                                        }} title="Next">
                                    </Button>
                                    :
                                    <Button title="Before" onPress={() => {
                                        fetchMore({
                                            query: FEED_DATA,
                                            variables:{"after": item._id, move: "1"},
                                            updateQuery: (prev, {fetchMoreResult}) => {
                                            if (!fetchMoreResult) return prev;
                                                return fetchMoreResult;
                                            }
                                        })
                                    }}></Button>
                                }
                            </View>    
                        </Fragment>
                        );}}
                    keyExtractor={(item) => item._id.toString()}
                />    
            );
        }     
        handleRefresh() {
            //console.log("inside handle refresh value heee");
            this.setState(
                {
                  refreshing: true
                }
            );    
        }
        renderThumbsUp(postID, itemLiked, stateVal) {
            var varToCheck = false;
            console.log("inside render thumbs valueeeee hereeee");
            console.log(this.state.user_liked);
            if (this.state.user_liked == null || this.state.user_liked == undefined) {
                console.log("inside 1111");
                varToCheck = itemLiked
            } else {
                console.log("inside 2222222");
                varToCheck = this.state.user_liked
            }    
            console.log("final var to check vaue usss heree ==", varToCheck);
            if (varToCheck) {
                return (
                    <TouchableOpacity
                        style={styles.button2}
                        onPress={() => this.likeButtonPress(postID, !varToCheck)}
                    >
                        <Icon name="thumbs-up" size={40} style={styles.iconColor}></Icon>
                    </TouchableOpacity>    
                );
            } else {
                return (
                    <TouchableOpacity
                        style={styles.button2}
                        onPress={() => this.likeButtonPress(postID, !varToCheck)}
                    >
                        <Icon name="thumbs-o-up" size={40}></Icon>
                    </TouchableOpacity>    
                )
            }

        }
        renderLikeCount(likesCount) {
            //console.log('inside renderlikecount');
            //console.log(this.state);
            //{this.state.user_liked || this.user_liked ? <Icon name="thumbs-up" size={40} style={styles.iconColor}></Icon> : 
            //    <Icon name="thumbs-o-up" size={40}></Icon>
            //}
            this.likesCount = likesCount;
            //this.setState({user_liked: false})
            if (likesCount) {
               return ( <Text style={{right: 100}}>{likesCount}</Text> );
            } else {
               return ( <Text style={{right: 100}}>0</Text> );
            }
        }
        onMorePress() {
            console.log("inside this . on more press value hereeee");
            Alert.alert(
                'Boom',
                'This is an action call!',
                [{ text: 'Aw yeah!' }]
            )
        }

        async likeButtonPress(postID, likeStatus) {
            console.log('like status == ', likeStatus);
            var token_val = await AsyncStorage.getItem('@user_auth:token');
            console.log(this.state.user_liked);
            var formData = {
                'post_id': postID,
                'action': likeStatus
            }
            this.likeStatus =  likeStatus;
            this.user_liked = likeStatus;
            this.setState({user_liked: likeStatus, dummy: likeStatus.toString()})
            console.log("after set value == ", this.state.user_liked);
            if (!this.likesCount || (this.likesCount && this.likesCount == 0) && likeStatus) {
                console.log('inside create method heree going n');
                /* await axios.post('http://70.51.251.63:3000/likes/post/'+token_val, formData).then((response) => {
                    console.log('inside success value heree')
                    console.log(response);
                }, (error) => {
                    console.log('inside error value here going onnnnn')
                    console.log(error);
                }); */
            } else {
                console.log('inside update method here');
            }    
        }

        deleteButtonConfirmation() {
            console.log('inside delete confirmation section value hereeeee');
        }

        getPageQueryVariables() {
            return {"first":this.state.pageSize,"skip":(this.state.currentPage)*3}
        }    
    }
  
    const styles = StyleSheet.create({
        container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        //  padding: 30,
        //  marginTop: 3,
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            left: 120,
      //      backgroundColor: 'yellow', 
            alignSelf: 'flex-start'
        },
        button: {
            width:100, top:0, bottom: 0, left: 200
        },
        button2: {
            width:100, top:0, bottom: 0, left: 200
        },
        iconColor: {
            color :'#CD5C5C'
        },
        flex1: {
            flex: 1
        },
        left220: {left: 250, top: 0, bottom: 0},
        left100: {left: 100},
        iconContainer: {
            flexDirection: "row",
            justifyContent: "space-between"
        }
    });