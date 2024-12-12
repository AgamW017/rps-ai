// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const scissors = new GestureDescription('scissors'); 

// Thumb
scissors.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8)

for(let finger of [Finger.Index, Finger.Middle]){
    scissors.addCurl(finger, FingerCurl.NoCurl, 1.0);
    scissors.addDirection(finger, FingerCurl.HalfCurl, 0.5);
    scissors.addDirection(finger, FingerDirection.HorizontalLeft, 0.7);
    scissors.addDirection(finger, FingerDirection.HorizontalRight, 0.7);
}

for(let finger of [Finger.Pinky, Finger.Ring]){
    scissors.addCurl(finger, FingerCurl.FullCurl, 0.9);
    scissors.addDirection(finger, FingerDirection.HorizontalLeft, 0.7);
    scissors.addDirection(finger, FingerDirection.HorizontalRight, 0.7);
}




