import {
    createStackNavigator,
    createBottomTabNavigator, NavigationEvents
} from "react-navigation";
import React, { Component, Fragment } from "react";
import {Platform, StyleSheet, AppState, Text, View, Linking, Button, Image, ImageBackground, TouchableWithoutFeedback, FlatList, Alert, TouchableOpacity, TouchableHighlight, Dimensions, ScrollView} from 'react-native';
import { Container, Content, Header, Title, Body, Right, Left } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
//import Video from 'react-native-af-video-player';
import VideoControls from 'react-native-video-controls';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import axios from "axios";
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks'
import { responsePathAsArray } from "graphql";
import Share from 'react-native-share';
import LikePage from './like';
import VideoPage from './post_video';
import ViewMoreText from 'react-native-view-more-text';
import DescContainer from './desc_container';

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
                posted_user_name
                user_id
            }
        }    
`;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
//    const paddingToBottom = 0;
//    console.log("inside is close to bottm hereeee");
//    console.log("layout measurement.height =="+ layoutMeasurement.height + " ... content offser value ==", contentOffset.y);
//    console.log(contentSize.height);
//    console.log(contentSize);
//    console.log(layoutMeasurement.height + contentOffset.y >= contentSize.height - 50)
    //return layoutMeasurement.height + contentOffset.y >=
      //contentSize.height - 50;
    return contentOffset.y > 6; 
};
  
const ifCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    //console.log("inside is close to top value hereeee ==", layoutMeasurement.height);
    //console.log(contentOffset);
    return contentOffset.y <= -10;
};

var no_video_saved = true;
export default class social extends Component {  
    constructor() {
        super();
        this.onEndReachedCalledDuringMomentum = true;
        this.fetchingData = false;
        this.token_val = '';
        this.user_liked = false;
        this.state = {
            loading: true,
            tokenLoaded: false,
            no_video_saved: true,
            file_deleted: false,
            user: null,
            user_liked: false,
            pageSize: 1,
            currentPage: 1,
            currentPostID: undefined,
            refreshing: false,
            fetchingData: false,
            paused: true,
            onBlur: false,
            descContHeight: 250
        }
    }

   
    componentWillMount() {
        this.loadUserToken();
    }
    
    componentWillUnmount() {

    }

    async loadUserToken() {
        console.log("inside load user token value hereee ossss ==");
        this.token_val = await AsyncStorage.getItem('@user_auth:token');
        console.log(this.token_val);
        this.setState({tokenLoaded: true, paused: false});
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

    _onBlur() {
        console.log("insie on blur value hereeeeee --", this.state.paused);
        //this.setState({paused: !this.state.paused});
        console.log('after set value heree --', this.state.paused);
    }
    render() {
        const url = 'https://mashdub.s3.amazonaws.com/Initial+mashdub+videos/Video2.mp4'
        //const url = 'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DB7CB7CB-76D8-4F52-9DB7-E0D31D86DA4A/data/Containers/Data/Application/0AA145EF-EFA0-4F03-BB4A-9AD23F942827/Documents/e3PK5V7pb2_jnm.mp4'
        const logo = 'https://your-url.com/logo.png'
        const placeholder = 'https://your-url.com/placeholder.png'
        const title = 'My video title';
        console.log("theme is ....");
        console.log(theme);
        console.log('dimension value here isss == ////// <<<<<>>>>>');
        console.log(Dimensions);
        console.log(Dimensions.get('window'));
        console.log(Dimensions.get('window').width);
        //console.log(this.saved_videos);
        if (firebase.auth().currentUser) {
            var userID = firebase.auth().currentUser.uid;
        } else {
            var userID = '';
        }    
        console.log("this.token value here isss ==", this.token_val);
        console.log("FEED_DATA VALUE IS ==", FEED_DATA);
        console.log(FEED_DATA);
        console.log("this token val == (((())))) ==", this.token_val);
        var after = "5dc31dbf12aa2249843cf3a1", tempPath = "/Users/admin/Desktop/social_media/";
            return (
                <Query
                    query={FEED_DATA} variables={{after: "0", move: "0", token: this.token_val ? this.token_val : "0"}} 
                >
                    {({ loading, error, data, fetchMore }) => {
                    if (loading) return <Container style={{backgroundColor: '#FFFFFF'}}>                                            
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
                                                    <Title style={[styles.titleText, {left: 20}]}>Home</Title>
                                                </Body>
                                                <Right>
                                                </Right>
                                            </Header>
                                            <View>
                                                <View style={styles.loadscreen}>
                                                    <Image
                                                    style={[styles.loadimg, {top: 100}]}
                                                    source={require('../images/meme.png')}
                                                    /> 
                                                    <Text style={styles.profilename}>Loading...</Text>
                                                </View>                                                                                            
                                            </View>
                                        </Container>    
                    if (error) return <Text> {error} </Text>

                    console.log("data.user_liked == /////// <<<<>>>>> ///////", data.user_liked);
                    this.user_liked = data.user_liked      
                    console.log("data value here isss //");
                    console.log(data);  
                    console.log(data.posted_user_prof_pic);
                    return <Container style={{backgroundColor: '#FFFFFF'}}>
                                <NavigationEvents
                                    //onWillFocus={payload => console.log('will focus 44444444444444444444444444444444',payload)}
                                    //onDidFocus={() => this._onBlur()}
                                   /* onWillBlur={() => {
                                            console.log("inside willll blur vake herre ==", this.state.paused);
                                            this.setState({paused: true})
                                            console.log("33333 ..", this.state.paused);
                                        }
                                    } */
                                    //onDidBlur={() => this._onBlur()}
                                />
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
                                        <Title style={[styles.titleText, {left: 20}]}>Home</Title>
                                    </Body>
                                    <Right>
                                    </Right>
                                </Header>

                                <ScrollView style={{height: 500}}
                                    ref={ref => this.scrollView = ref}
                                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                                        //this.scrollView.scrollToEnd({x:0, y:0, animated: true});  has_prev_page_flag
                                    }}
                                    disableIntervalMomentum={true}
                                    onScroll={({nativeEvent}) => {
                                        if (isCloseToBottom(nativeEvent) && !this.fetchingData) {
                                            console.log("inside crossing close to bottom condition here");
                                            if (data.feeds_data[0].has_next_page_flag) {
                                                this.fetchingData = true;
                                                this.scrollView.scrollToEnd({x:0, y:20, animated: true})
                                                                                                fetchMore({
                                                    query: FEED_DATA,
                                                    variables:{"after": data.feeds_data[0]._id, move: "2", token: this.token_val ? this.token_val : "0"},
                                                    updateQuery: (prev, {fetchMoreResult}) => {
                                                    if (!fetchMoreResult) return prev;
                                                        return fetchMoreResult;
                                                    }
                                                })
                                            } else {
                                                alert("You are in last page");
                                            }    
                                        } else if (ifCloseToTop(nativeEvent) && !this.fetchingData) {
                                            console.log("inside before close to bottom condition hereee");
                                            console.log(data.feeds_data[0]);
                                            if (data.feeds_data[0].has_prev_page_flag) {
                                                this.fetchingData = true;
                                                fetchMore({
                                                    query: FEED_DATA,
                                                    variables:{"after": data.feeds_data[0]._id, move: "1", token: this.token_val ? this.token_val : "0"},
                                                    updateQuery: (prev, {fetchMoreResult}) => {
                                                    if (!fetchMoreResult) return prev;
                                                        return fetchMoreResult;
                                                    }
                                                })
                                            } else {
                                                alert("You are in first page of social media");
                                            }    
                                        } else {
                                            console.log("entered waiting stage here");
                                        } 
                                    }} 
                                    scrollEventThrottle={1600}
                                    alwaysBounceVertical={true}
                                    horizontal={false}
                                >
                                    <FlatList
                                        refreshing={loading}
                                        data={data.feeds_data}
                                        ItemSeparatorComponent={this.mySeparator}
                                        renderItem={({item}) => {
                                            //console.log("inside render item value going on heree");
                                            //console.log(this.state);
                                            //this.setState({fetchingData: false});
                                            this.fetchingData = false;
                                        return (
                                        <Fragment>
                                            <View key = {item._id} style={[styles.container, {paddingTop: 2}]}>   

                                                <View style={{flex: 1, flexDirection: 'row'}}>
                                                        <View style={{top: 10}}>
                                                            <TouchableHighlight 
                                                                style={{
                                                                borderWidth:1,
                                                                borderColor:'white',
                                                                //alignItems:'center',
                                                                //justifyContent:'center',
                                                                width:60,
                                                                height:60,
                                                                backgroundColor:'#fff',
                                                                borderRadius:50,
                                                                //top: 15,
                                                                //justifyContent: 'center',
                                                                //alignSelf: 'center'
                                                                }}
                                                            >
                                                                <Image source={{uri : item.posted_user_prof_pic ? item.posted_user_prof_pic : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKoh_wxk-fkGGHm4pP_Mwe6v-P6weOYRpuchqAu0K0VYoDj4AVQg'}} style={{ width: 50, height: 50, borderRadius: 25,marginBottom:8 }} imageStyle={{ borderRadius: 25 }}>
                                                                    
                                                                </Image>
                                                            </TouchableHighlight> 
                                                        </View>      
                                                    <View>    
                                                        <Text style={[styles.emailText, {top: 20}]}>{item.posted_user_name && item.posted_user_name.length > 8 ? "@" + item.posted_user_name.slice(0,25): "@" + item.posted_user_name}</Text>
                                                    </View>
                                                </View>    

                                                <VideoPage data={item}></VideoPage>
                                               
                                                <View style={styles.full}>
                                                    <View style={{flex:.5,justifyContent:'flex-end'}}>
                                                    
                                                    </View>
                                                    <View style={{flex:.5,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                        <View>
                                                            
                                                        </View>
                                                        
                                                        <LikePage data={ item } navigation={this.props.navigation}/>
                                                           
                                                        <View style={{top: 50}}>
                                                            <TouchableOpacity onPress={() => this.handleShareButtonTouch(item.post_media[0])}>
                                                                <Icon name="share-alt" size={40} color="white"  />
                                                            </TouchableOpacity>
                                                            <Text style={styles.share}>share</Text>
                                                        </View>    
                                                    </View>
                                                </View>

                                            </View>    

                                            <DescContainer data={item} navigation={this.props.navigation}></DescContainer>


                                            <View style={{paddingTop: 60, flexDirection: 'row'}}>
                                            
                                                <View style={{flex: 1, alignItems: 'center'}}>
                                                    {item.has_prev_page_flag ? 
                                                        <TouchableOpacity onPress={async() => {
                                                                console.log("before getting token value hereeee 11111");
                                                                this.token_val = await AsyncStorage.getItem('@user_auth:token');
                                                                console.log("this.token_val iss ==", this.token_val);
                                                                fetchMore({
                                                                    query: FEED_DATA,
                                                                    variables:{"after": item._id, move: "1", token: this.token_val ? this.token_val : "0"},
                                                                    updateQuery: (prev, {fetchMoreResult}) => {
                                                                    if (!fetchMoreResult) return prev;
                                                                        return fetchMoreResult;
                                                                    }
                                                                })
                                                            }}>
                                                            <Image
                                                                style={styles.videobackbtn}
                                                                source={require('../images/previous.png')}
                                                            />
                                                        </TouchableOpacity>    
                                                        :
                                                        <TouchableOpacity onPress={() => {alert("You are in first page of social media")}}>
                                                            <Image
                                                                style={[styles.videobackbtn]}
                                                                source={require('../images/previous.png')}
                                                            />
                                                        </TouchableOpacity>                                                    
                                                    }
                                                </View>
                                                <View style={{flex: 1, alignItems: 'center'}}>
                                                    {item.has_next_page_flag ? 
                                                        <TouchableOpacity onPress={async() => {
                                                                console.log("before getting token value hereeee 222222");
                                                                this.token_val = await AsyncStorage.getItem('@user_auth:token');
                                                                console.log("this.token_val iss ==", this.token_val);
                                                                fetchMore({
                                                                    query: FEED_DATA,
                                                                    variables:{"after": item._id, move: "2", token: this.token_val ? this.token_val : "0"},
                                                                    updateQuery: (prev, {fetchMoreResult}) => {
                                                                    if (!fetchMoreResult) return prev;
                                                                        return fetchMoreResult;
                                                                    }
                                                                })
                                                         }} >
                                                            <Image
                                                                style={styles.videobackbtn}
                                                                source={require('../images/next.png')}
                                                            />
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity onPress={() => {alert("You are in last page of social media")}}>
                                                            <Image
                                                                style={[styles.videobackbtn]}
                                                                source={require('../images/next.png')}
                                                            />
                                                        </TouchableOpacity> 
                                                    }
                                                </View>
                                            </View>    
                                        </Fragment>
                                        );}}
                                    keyExtractor={(item) => item._id.toString()}
                                />    
                            </ScrollView>
                            
                        </Container> 
                    }}
                </Query>
            );
        }     
        handleRefresh() {
        //console.log("inside handle refresh value heee");
        //onPress={() => this.props.navigation.navigate('EditorScreen', { 'video_url': "http://70.51.251.63/" + item.post_media[0], 'loaded': true, 'from': 'home'})}>        
            this.setState(
                {
                  refreshing: true
                }
            );    
        }
        renderLikeCount(likesCount) {
            //console.log('inside renderlikecount');
            //console.log(this.state);
            if (likesCount) {
               return ( <Text>{likesCount}</Text> );
            } else {
               return ( <Text>0</Text> );
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

        async handleShareButtonTouch(filePath) {
            console.log("inside handle share button touch value hereeeee");
            console.log("file path value here iss ==", filePath);
            let options = {
                url: filePath, // (Platform.OS === 'android' ? 'file://' + filePath),
                message: 'Hi please have a look at this Me-Me video',
                title: 'Me-Me',
                subject: 'Me-Me Video'
              };
            //await Share.open(options);
            const shareResponse = Share.open(options)
                .then(res => ({ error: '', payload: res, success: true }))
                .catch(err => ({ error: (err && err.error) || 'User did not share', payload: {}, success: false }));

            return shareResponse;
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
            //justifyContent: 'center',
            //alignItems: 'center',
            //backgroundColor: '#0000FF'
            //  padding: 30,
            //  marginTop: 3,
        },
        full:{
            flex:1,
            flexDirection:'row'
        },
        rightside:{
            flex:1,
            alignItems:'flex-end',
            justifyContent:'flex-end',
            margin:8
        },
        leftside:{
          alignItems:'flex-start'
        },
        rightcontent:{
            alignItems:'center',
            justifyContent:'center'
        },
        likecount:{
            color:'white',
            marginLeft:5,
            justifyContent:'center',
            alignItems:'center',
            marginBottom:8
        },
        emailText: {
            color:'black',
            fontFamily: 'DamascusSemiBold',
//            marginLeft:5,
//            justifyContent:'center',
//            alignItems:'center',
//            marginBottom:8
        },
        commentcount:{
            color:'white',
            marginLeft:10,
            justifyContent:'center',
            alignItems:'center',
            marginBottom:8
        },
        share:{
            color:'white',
            justifyContent:'center',
            alignItems:'center',
        },
        tagtitle:{
           
           padding:10,
           color:'white',
           fontSize:12,
           fontWeight:'bold'
           
        },
        tag:{
            backgroundColor:'#f20b3a',
            margin:10,
            justifyContent:'center',
            alignItems:'center',
            borderRadius:8
        },
        username:{
            fontWeight:'bold',
            color:'white',
            marginLeft:8
        },
        commentsBottom:{
            color:'white',
            marginLeft:8
        },
        userimage:{
            width:40,
            height:40,
            borderRadius:40/2
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#101010',
            left: 120,
      //      backgroundColor: 'yellow', 
            alignSelf: 'flex-start'
        },
        button: {
            width:100, top:0, bottom: 0, left: 200
        },
        button2: {
            width:100, top:0, bottom: 0, 
            //left: 200
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
            //flexDirection: "row",
            flex: 1,
            //alignContent: "flex-end"
        },
        avatar: {
            width: 75,
            height: 75,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#CD5C5C',
            alignItems:'center',
            justifyContent:'center',
            //marginBottom:10,
            //alignSelf:'center',
            //position: 'absolute',
            //marginTop:25,
            bottom: 16
        },
        loadscreen: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
        },
        loadimg:{
           width: 50,
           height:50,
        },
        videobackbtn:{
            width: 35,
            height:25,
        }
    });