//
//  MashDubVideoPrepBridge.m
//  mashtub
//
//  Created by Dev on 2019-06-26.
//  Copyright © 2019 Facebook. All rights reserved.
//

/*#import <Foundation/Foundation.h>


// MashDubVideoPrepBridge.m
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MashDubVideoPrep, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(NSNumber *)date)

@end
*/

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


@interface RCT_EXTERN_MODULE(MashDubVideoPrep, NSObject)
    RCT_EXTERN_METHOD(doThis)
    RCT_EXTERN_METHOD(download:(NSString*)fileUrl callback:(RCTResponseSenderBlock))
RCT_EXTERN_METHOD(mergeFilesWithUrl:(NSString*)videoUrl audioPath:(NSString*)audioUrl displayName:(NSString*)dispName callback:(RCTResponseSenderBlock))
    RCT_EXTERN_METHOD(removeAudioFn:(NSString*)videoUrl)
@end






