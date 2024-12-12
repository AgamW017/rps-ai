// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const rock = new GestureDescription('rock'); 

// Thumb 
//rock.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.9);
rock.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.9);
rock.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.9);

for(let finger of [Finger.Index, Finger.Pinky, Finger.Middle, Finger.Ring]){
    rock.addCurl(finger, FingerCurl.FullCurl, 1.0); 
    rock.addDirection(finger, FingerDirection.HorizontalLeft, 0.9);
    rock.addDirection(finger, FingerDirection.HorizontalRight, 0.9);
}




