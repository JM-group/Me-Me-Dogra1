//
//  VideoShaping.m
//  mashtub
//
//  Created by Dev on 2019-06-21.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "VideoShaping.h"

@implementation VideoShaping
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(greetUser:(NSString *)name isAdmin:(BOOL *)isAdmin calback:
                  (RCTResponseSenderBlock) callback) {
  NSLog(@"User Name: %@ , Administrator: %@", name, isAdmin ? @"Yes": @"No");
  
  NSString *greeting = [NSString stringWithFormat:@"Welcome %@, you %@ an administrator", name, isAdmin ? @"are": @"are not"];
  
  callback(@[greeting]);
}
@end