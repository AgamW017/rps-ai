// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Drawing function
export const drawHand = (predictions, ctx) => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      const scale = 1; // Adjust this value to scale the hand pose
      const centerX = landmarks[0][0]; // Use the first landmark as the center point
      const centerY = landmarks[0][1];

      // Loop through fingers
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        //  Loop through pairs of joints
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          // Draw path
          ctx.beginPath();
          ctx.moveTo(
            centerX + (landmarks[firstJointIndex][0] - centerX) * scale,
            centerY + (landmarks[firstJointIndex][1] - centerY) * scale
          );
          ctx.lineTo(
            centerX + (landmarks[secondJointIndex][0] - centerX) * scale,
            centerY + (landmarks[secondJointIndex][1] - centerY) * scale
          );
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // Loop through landmarks and draw them
      for (let i = 0; i < landmarks.length; i++) {
        const x = centerX + (landmarks[i][0] - centerX) * scale;
        const y = centerY + (landmarks[i][1] - centerY) * scale;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = "indigo";
        ctx.fill();
      }
    });
  }
};
