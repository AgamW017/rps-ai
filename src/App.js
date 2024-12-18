import React, { useRef, useState, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import '@tensorflow/tfjs-backend-webgl';
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
import { paper } from "./paper";
import { rock } from "./rock";
import { scissors } from "./scissors";
import { thumbsup } from "./thumbsup";
import * as fp from "fingerpose";
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from './firebaseConfig';
import Overlay from "./Overlay";
import {initiate,aiOutput} from "./ai-output";

const findMostOccurring = (arr) => {
	const frequency = {};
	let maxCount = 0;
	let mostOccurring = null;

	for (const value of arr) {
		frequency[value] = (frequency[value] || 0) + 1;
		if (frequency[value] > maxCount) {
			maxCount = frequency[value];
			mostOccurring = value;
		}
	}

	return mostOccurring;
}

function App() {
	const [isOverlayVisible, setOverlayVisible] = useState(false);
	const [overlayMessage, setOverlayMessage] = useState(null);
	const [resolveOverlayPromise, setResolveOverlayPromise] = useState(null);

	// Function to trigger the overlay and return a Promise that resolves when the overlay disappears
	const triggerOverlay = (message) => {
		setOverlayMessage(message);
		setOverlayVisible(true);

		return new Promise((resolve) => {
			setResolveOverlayPromise(() => resolve);
		});
	};

	// Automatically hide the overlay after 2 seconds
	useEffect(() => {
		if (isOverlayVisible) {
			const timer = setTimeout(() => {
				setOverlayVisible(false);
				if (resolveOverlayPromise) {
					resolveOverlayPromise(); // Resolve the promise to "unpause" the code
					setResolveOverlayPromise(null); // Clean up the resolve function
				}
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [isOverlayVisible, resolveOverlayPromise]);

	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	let move = "none";
	const runHandpose = async () => {
		const net = await handpose.load();
		console.log("Handpose model loaded.");

		setInterval(() => {
			let mod = [];
			const detectHands = async () => {
				for (let i = 0; i < 7; i++) {
					const detected = await detect(net);
					mod.push(detected);
					await new Promise(resolve => setTimeout(resolve, 100));
				}
				return mod;
			};

			detectHands().then(async (mod) => {
				let act_move = findMostOccurring(mod);
				document.getElementById("detection-results").innerText = "Human Move: " + act_move;
			  
				if (act_move === "thumbsup") {
				  initiate();
				  console.log("Game reset.");
				  document.getElementById("score").innerHTML = "<h1>Score:</h1><p>Human: 0</p><p>AI: 0</p><p>Thumbsup to reset, Remove hand to pause.</p>";
				} else if (act_move && act_move !== "none") {
				  // Send move data to Firebase
				  console.log('sending ', act_move)
				  const movesRef = ref(database, 'moves');
				  push(movesRef, {
					move: act_move,
					timestamp: serverTimestamp()
				  });
				  console.log("Move", act_move, "logged.");
				  let res = aiOutput(act_move);
				  if (res[1]=== 0){
					await triggerOverlay("You chose " + act_move + ", AI chose " + res[0] + ". It's a tie!");
					document.getElementById("score").innerHTML = "<h1>Score:</h1><p>Human: " + res[2][0] + "</p><p>AI: " + res[2][1] + "</p><p>Thumbsup to reset, Remove hand to pause.</p>";
				  }
				  else if (res[1]=== 1){
					await triggerOverlay("You chose " + act_move + ", AI chose " + res[0] + ". You win!");
					document.getElementById("score").innerHTML = "<h1>Score:</h1><p>Human: " + res[2][0] + "</p><p>AI: " + res[2][1] + "</p><p>Thumbsup to reset, Remove hand to pause.</p>";
				  }
				  else{
					await triggerOverlay("You chose " + act_move + ", AI chose " + res[0] + ". You lose!");
					document.getElementById("score").innerHTML = "<h1>Score:</h1><p>Human: " + res[2][0] + "</p><p>AI: " + res[2][1] + "</p><p>Thumbsup to reset, Remove hand to pause.</p>";
				  }
				}
			  });
		}, 3000);
	};

	const detect = async (net) => {
		if (
			typeof webcamRef.current !== "undefined" &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get Video Properties
			const video = webcamRef.current.video;
			const videoWidth = webcamRef.current.video.videoWidth;
			const videoHeight = webcamRef.current.video.videoHeight;

			// Set video width
			webcamRef.current.video.width = videoWidth;
			webcamRef.current.video.height = videoHeight;

			// Set canvas height and width
			canvasRef.current.width = videoWidth;
			canvasRef.current.height = videoHeight;

			// Make Detections
			const hand = await net.estimateHands(video);
			move = "none";
			if (hand.length > 0) {
				const GE = new fp.GestureEstimator([
					rock,
					paper,
					scissors,
					thumbsup
				]);
				const gesture = await GE.estimate(hand[0].landmarks, 4);
				if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
					console.log(gesture.gestures);

					const confidence = gesture.gestures.map(
						(prediction) => prediction.confidence
					);
					const maxConfidence = confidence.indexOf(
						Math.max.apply(null, confidence)
					);
					move = gesture.gestures[maxConfidence].name;
				}
			}

			// Draw mesh
			const ctx = canvasRef.current.getContext("2d");
			drawHand(hand, ctx);
			return move;
		}
	};

	useEffect(() => { runHandpose() }, []);

	return (
		<div className="App">
			{isOverlayVisible && (
				<Overlay onClose={() => setOverlayVisible(false)} message={overlayMessage} />
			)}
			<h1 className="headline">Rock Paper Scissors</h1>
			<div id="game">
				<div className="frames">
					<div className="frame">
						<div className="webcam-container">
							<Webcam
								ref={webcamRef}
								style={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									borderRadius: '10px',
									objectFit: 'cover',
									transform: 'scaleX(-1)',
								}}
							/>
							<canvas
								ref={canvasRef}
								style={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									borderRadius: '10px',
									transform: 'scaleX(-1)',
								}}
							/>
						</div>
						<div id="detection-results">
							<p>No detections yet.</p>
						</div>
					</div>
				</div>
				<div id="score"><h1>Score:</h1><p>Human: 0</p><p>AI: 0</p><p>Thumbsup to reset, Remove hand to pause.</p></div>
			</div>
			<footer>Made by Saaransh and Agam</footer>
		</div>
	);
}

export default App;
