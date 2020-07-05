//
//  MashDubVideoPrep.swift
//  mashtub
//
//  Created by Dev on 2019-06-26.
//  Copyright © 2019 Facebook. All rights reserved.
//

/*import Foundation
 
 @objc(MashDubVideoPrep)
 class MashDubVideoPrep: NSObject {
 
 @objc func addEvent(_ name: String, location: String, date: NSNumber) -> Void {
 // Date is ready to use!
 NSLog("%@ %@ %S", name, location, date);
 }
 
 }
 */

import Foundation
import UIKit
import AVFoundation
import AVKit
import AssetsLibrary

@objc(MashDubVideoPrep)
class MashDubVideoPrep: NSObject {
  
  @objc func doThis() -> Void {
    // w00t
  }
  
  @objc func download(_ fileUrl: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    
    callback([NSNull(), [
      "destinationPath": "fdsfdsfndsfndsfnsdnfsdjfds"
      ]])
  }
  
  @objc func mergeFilesWithUrl(_ videoUrl:String, audioPath audioUrl:String, displayName dispName:String, callback: @escaping RCTResponseSenderBlock) -> Void {
    print ("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>")
    print (dispName)
    let mixComposition : AVMutableComposition = AVMutableComposition()
    var mutableCompositionVideoTrack : [AVMutableCompositionTrack] = []
    var mutableCompositionAudioTrack : [AVMutableCompositionTrack] = []
    let totalVideoCompositionInstruction : AVMutableVideoCompositionInstruction = AVMutableVideoCompositionInstruction()
    
    let videoUrlAsset = URL(fileURLWithPath: videoUrl)
    let audioUrlAsset = URL(fileURLWithPath: audioUrl)
    
    let aVideoAsset : AVAsset = AVAsset(url: videoUrlAsset)
    let aAudioAsset : AVAsset = AVAsset(url: audioUrlAsset)
    
    mutableCompositionVideoTrack.append(mixComposition.addMutableTrack(withMediaType: AVMediaType.video, preferredTrackID: kCMPersistentTrackID_Invalid)!)
    mutableCompositionAudioTrack.append(mixComposition.addMutableTrack(withMediaType: AVMediaType.audio, preferredTrackID: kCMPersistentTrackID_Invalid)!)
    
    let aVideoAssetTrack : AVAssetTrack = aVideoAsset.tracks(withMediaType: AVMediaType.video)[0]
    let aAudioAssetTrack : AVAssetTrack = aAudioAsset.tracks(withMediaType: AVMediaType.audio)[0]
    
    do{
      try mutableCompositionVideoTrack[0].insertTimeRange(CMTimeRangeMake(kCMTimeZero, aVideoAssetTrack.timeRange.duration), of: aVideoAssetTrack, at: kCMTimeZero)
      
      try mutableCompositionAudioTrack[0].insertTimeRange(CMTimeRangeMake(kCMTimeZero, aVideoAssetTrack.timeRange.duration), of: aAudioAssetTrack, at: kCMTimeZero)
    }catch{
      
    }
    totalVideoCompositionInstruction.timeRange = CMTimeRangeMake(kCMTimeZero,aVideoAssetTrack.timeRange.duration )
    
    
    
    // Code to check video orientation begins
    
    var videoAssetOrientation_: UIImage.Orientation = .up
    var isVideoAssetPortrait_ = false
    var isFirst = false, isSecond = false, isThird = false, isFourth = false
    let videoTransform = aVideoAssetTrack.preferredTransform
    print ("909090909090909909090909090909090090909099099099090909")
    print (videoTransform)
    
    var t1: CGAffineTransform = .identity
    var t2: CGAffineTransform = .identity
    
    var transforms2 = aVideoAssetTrack.preferredTransform
    print ("0000000003328y483248238423")
    print (transforms2)
    
    if videoTransform.a == 0 && videoTransform.b == 1.0 && videoTransform.c == -1.0 && videoTransform.d == 0 {
      videoAssetOrientation_ = .right
      print ("1111111111111")
      isVideoAssetPortrait_ = true
      isFirst = true
      transforms2 = transforms2.concatenating(CGAffineTransform(rotationAngle: CGFloat(90.0 * .pi / 180)))
      print (CGFloat(90.0 * .pi / 180))
      transforms2 = transforms2.concatenating(CGAffineTransform(translationX: 1280, y: 0))
      print (transforms2)
    }
    if videoTransform.a == 0 && videoTransform.b == -1.0 && videoTransform.c == 1.0 && videoTransform.d == 0 {
      print ("2222222222222")
      videoAssetOrientation_ = .left
      isVideoAssetPortrait_ = true
      isSecond = true
    }
    if videoTransform.a == 1.0 && videoTransform.b == 0 && videoTransform.c == 0 && videoTransform.d == 1.0 {
      print ("3333333333333")
      videoAssetOrientation_ = .up
      isThird = true
    }
    if videoTransform.a == -1.0 && videoTransform.b == 0 && videoTransform.c == 0 && videoTransform.d == -1.0 {
      print ("44444444444444")
    //  isVideoAssetPortrait_ = true
      videoAssetOrientation_ = .down
      isFourth = true
    }
    
    
    // Watermark Effect Code Begins
    let size = aVideoAssetTrack.naturalSize
    
    // Code for placement of logo in video begins
    
    //let imglogo = UIImage(named: "image.png")
    let imglogo = UIImage(named: "LuvDub.jpeg")
    let imglayer = CALayer()
    print("<<<<<<<<<<<< img logo newwww >>>>>>>>>>>>>>>>>>>>>>>")
    print(imglogo)
    print(size)
    print(videoUrl)
    imglayer.contents = imglogo?.cgImage
    if (isFirst) {
      print ("111111111111111111111111111111111111111111111111111111")
      imglayer.frame = CGRect(x: size.height - ((size.height / 6)), y: (size.width / 9), width: size.height / 8, height: size.width / 10)
    } /* else if (isThird) {
      print ("inside is thrid checkckkkkkkkkk")
      imglayer.frame = CGRect(x: size.width - ((size.width / 6)), y: (size.height / 11), width: size.width / 8, height: size.height / 14)
    } */ else {
      print ("22222222222222222222222222222222222222222222222222222222")
      imglayer.frame = CGRect(x: size.width - ((size.width / 6)), y: (size.height / 9), width: size.width / 8, height: size.height / 6)
    }
    imglayer.backgroundColor = UIColor.black.cgColor
    
    // Code for placement of user name under logo starts
    let titleLayer = CATextLayer()
    titleLayer.backgroundColor = UIColor.clear.cgColor
    titleLayer.string = dispName
    
    titleLayer.foregroundColor = UIColor.black.cgColor
    //    titleLayer.frame = CGRect(x: size.width - ((size.width / 6)), y:2, width: 500, height: size.height / 10)
    if (isFirst) {
      titleLayer.fontSize = size.height / 22.5
      titleLayer.font = UIFont(name: "Helvetica", size: 20)
      titleLayer.frame = CGRect(x: size.height - ((size.height / 4.5)), y: (size.width / 50), width: 300, height: size.width / 14)
    } /* else if (isThird) {
      print ("inside is thrid checkckkkkkkkkk")
      titleLayer.fontSize = size.height / 40
      titleLayer.font = UIFont(name: "Helvetica", size: 12)
      titleLayer.frame = CGRect(x: size.width - ((size.width / 4.5)), y: (size.height / 30), width: 150, height: size.height / 17)
    } */ else {
      titleLayer.fontSize = size.height / 22.5
      titleLayer.font = UIFont(name: "Helvetica", size: 20)
      titleLayer.frame = CGRect(x: size.width - ((size.width / 5.5)), y: (size.height / 50), width: 500, height: size.height / 12)
    }
    titleLayer.opacity = 1
    titleLayer.display()
    print ("33322222255444whi//////teeee555e33333333333333333333333333333333333333333333")
    //print (UIScreen.main.scale)
   
    // Code for video layer starts
    
    let videolayer = CALayer()
    //videolayer.frame = CGRect(x:0, y:0, width: size.width, height: size.height)
    if (isFirst) {
      print ("inside video layer crossedddd is fourth condition hereeeeee")
      videolayer.frame = CGRect(x:0, y:0, width: size.height, height: size.width)
    } else {
      print ("inside video layer not crossing here is fourth conditionnnnnnn")
      videolayer.frame = CGRect(x:0, y:0, width: size.width, height: size.height)
    }
    //videolayer.frame = CGRect(x:0, y:0, width: 360, height: 800)
    
    // Combining video, text and image layer to one layer
    let parentlayer = CALayer()
    if (isFirst) {
      print ("inside video layer crossedddd is fourth condition hereeeeee")
      parentlayer.frame = CGRect(x:0, y:0, width: size.height, height: size.width)
    } else {
      print ("inside video layer not crossing here is fourth conditionnnnnnn")
      parentlayer.frame = CGRect(x:0, y:0, width: size.width, height: size.height)
    }
//    parentlayer.frame = CGRect(x:0, y:0, width: size.width, height: size.height)
    parentlayer.addSublayer(videolayer)
    parentlayer.addSublayer(titleLayer)
    parentlayer.addSublayer(imglayer)
    
    
    
    let layercomposition = AVMutableVideoComposition()
    layercomposition.frameDuration = CMTimeMake(1, 30)
    print ("layer composition frame duration iss ==")
    print (layercomposition.frameDuration)
    //layercomposition.renderSize = size
    if (isFirst) {
      print ("crossedddd is fourth condition hereeeeee")
      layercomposition.renderSize = CGSize(width: size.height, height: size.width)
    } else {
      print ("not crossing here is fourth conditionnnnnnn")
      layercomposition.renderSize = CGSize(width: size.width, height: size.height)
    }
      layercomposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videolayer, in: parentlayer)
    
    
    
    // instruction for watermark
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRangeMake(kCMTimeZero, mixComposition.duration)
    let videotrack = mixComposition.tracks(withMediaType: AVMediaType.video)[0] as AVAssetTrack
    print ("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    print (videotrack.preferredTransform)
    let layerinstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: videotrack)
    instruction.layerInstructions = NSArray(object: layerinstruction) as [AnyObject] as! [AVVideoCompositionLayerInstruction]
    layercomposition.instructions = NSArray(object: instruction) as [AnyObject] as! [AVVideoCompositionInstructionProtocol]
    print ("mix compositin duration size is ==")
    print (mixComposition.duration)
    //////////
   
    
    // Video orientation fix code
    /// rotation stopping code
    var FirstAssetScaleToFitRatio = aVideoAssetTrack.naturalSize.height / (aVideoAssetTrack.naturalSize.width ?? 0.0)
 
    if isVideoAssetPortrait_ {
     //FirstAssetScaleToFitRatio = 320.0 / (aVideoAssetTrack.naturalSize.height ?? 0.0)
     // FirstAssetScaleToFitRatio = aVideoAssetTrack.naturalSize.width / aVideoAssetTrack.naturalSize.height
      FirstAssetScaleToFitRatio = UIScreen.main.bounds.width / aVideoAssetTrack.naturalSize.height
      print ("009999")
      print (FirstAssetScaleToFitRatio)
      
      print (FirstAssetScaleToFitRatio)
     // var FirstAssetScaleFactor = CGAffineTransform(scaleX: 1.4, y: 0.8)
      var FirstAssetScaleFactor = CGAffineTransform(scaleX: FirstAssetScaleToFitRatio, y: FirstAssetScaleToFitRatio)
      print (FirstAssetScaleFactor)
      //naturalSizeFirst = CGSize(width: FirstAssetTrack.naturalSize.height, height: FirstAssetTrack.naturalSize.width)
      print ("after value setttttttttttttttttttttttttttttttt")
      
      print (FirstAssetScaleFactor)
      print (layerinstruction)
      //layerinstruction.setTransform(aVideoAssetTrack.preferredTransform.concatenating(FirstAssetScaleFactor), at: kCMTimeZero)
      layerinstruction.setTransform(aVideoAssetTrack.preferredTransform, at: kCMTimeZero)
    } else if (isFourth) {
      print ("inside elseeeeeeeeeeeeeeeee blcccckkkkkkkkkk uuuuuuuuuuuuuuuuuuuuuuuuu")
      transforms2 = transforms2.concatenating(CGAffineTransform(rotationAngle: CGFloat(90.0 * .pi / 180)))
      print (CGFloat(90.0 * .pi / 180))
      transforms2 = transforms2.concatenating(CGAffineTransform(translationX: 1280, y: 0))
      print (transforms2)
      let FirstAssetScaleFactor = CGAffineTransform(scaleX: 1.0, y: 0.8)
      print (FirstAssetScaleFactor)
      //layerinstruction.setTransform(aVideoAssetTrack.preferredTransform.concatenating(transforms2).concatenating(CGAffineTransform(translationX: 0, y: 160)), at: kCMTimeZero)
      layerinstruction.setTransform(aVideoAssetTrack.preferredTransform.concatenating(CGAffineTransform(translationX: 0, y: 0)), at: kCMTimeZero)
    }
    print ("video duration value ggggggggggggggggggggggggg")
    print(aVideoAssetTrack.minFrameDuration)
    //layerinstruction.setOpacity(0.0, at: aVideoAssetTrack.minFrameDuration)
    ///////////////////////////////////////
    
    
    let mutableVideoComposition : AVMutableVideoComposition = AVMutableVideoComposition()
    mutableVideoComposition.frameDuration = CMTimeMake(1, 30)
    
    if (isFirst) {
      print ("-------- crossedddd is fourth condition hereeeeee")
      mutableVideoComposition.renderSize = CGSize(width: size.height, height: size.width)
    } else {
      print ("--------- not crossing here is fourth conditionnnnnnn")
      mutableVideoComposition.renderSize = CGSize(width: size.width, height: size.height)
    }

    //mutableVideoComposition.renderSize = CGSize(width: aVideoAssetTrack.naturalSize.width, height: aVideoAssetTrack.naturalSize.height)
    
    //find your video on this URl
    let random_name = randomString(length: 10) + "_jnm.mp4";
    let savePathUrl : URL = URL(fileURLWithPath: NSHomeDirectory() + "/Documents/" + random_name)
    
    //let assetExport: AVAssetExportSession = AVAssetExportSession(asset: mixComposition, presetName: //AVAssetExportPresetHighestQuality)!
    //Above two lines are code for export which i commented
    let assetExport: AVAssetExportSession = AVAssetExportSession(asset: mixComposition, presetName:AVAssetExportPreset640x480)!
    assetExport.outputFileType = AVFileType.mp4
    assetExport.outputURL = savePathUrl
    assetExport.videoComposition = layercomposition
    assetExport.shouldOptimizeForNetworkUse = true
    do { // delete old video
      try FileManager.default.removeItem(at: savePathUrl)
    } catch { print(error.localizedDescription) }
    assetExport.exportAsynchronously { () -> Void in
      switch assetExport.status {
        
      case AVAssetExportSessionStatus.completed:
        ALAssetsLibrary().writeVideoAtPath(toSavedPhotosAlbum: savePathUrl, completionBlock: nil)
        print("successssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
        callback([NSNull(), [
          "destinationPath": savePathUrl.absoluteString
          ]])
        
      case  AVAssetExportSessionStatus.failed:
        print("failefjdsnfkdsfjndsjfndsjfndjsfnjdsnfjdsd \(assetExport.error)")
      case AVAssetExportSessionStatus.cancelled:
        print("cancelledddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd \(assetExport.error)")
      default: print("completeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      }
    }
    
    
  }
  
  func randomString(length: Int) -> String {
    
    let letters : NSString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let len = UInt32(letters.length)
    
    var randomString = ""
    
    for _ in 0 ..< length {
      let rand = arc4random_uniform(len)
      var nextChar = letters.character(at: Int(rand))
      randomString += NSString(characters: &nextChar, length: 1) as String
    }
    
    return randomString
  }
  
}




