// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const paper = new GestureDescription('paper'); 

// Thumb 
paper.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
paper.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.8);
paper.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.8);

for(let finger of [Finger.Index, Finger.Pinky]){
    paper.addCurl(finger, FingerCurl.NoCurl, 1.0); 
    paper.addDirection(finger, FingerDirection.VerticalUp, 0.8);
}

for(let finger of [Finger.Middle, Finger.Ring]){
    paper.addCurl(finger, FingerCurl.NoCurl, 1.0); 
    paper.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}




