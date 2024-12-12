// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const thumbsup = new GestureDescription('thumbsup'); 

// Thumb 
thumbsup.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsup.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);

for(let finger of [Finger.Index, Finger.Pinky, Finger.Middle, Finger.Ring]){
    thumbsup.addCurl(finger, FingerCurl.FullCurl, 0.9); 
    thumbsup.addDirection(finger, FingerDirection.HorizontalLeft, 0.9);
    thumbsup.addDirection(finger, FingerDirection.HorizontalRight, 0.9);
}


