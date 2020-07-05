//
//  VideoShaping.swift
//  mashtub
//
//  Created by MOHAMED ASHIF on 21/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(VideoShaping)
class VideoShaping: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["initialCount": 0]
  }
}
