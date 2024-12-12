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

	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	let move = "thumbsup";
	const runHandpose = async () => {
		const net = await handpose.load();
		console.log("Handpose model loaded.");
			// Loop and detect hands
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
			
				detectHands().then((mod) => {
					let act_move = findMostOccurring(mod);
					document.getElementById("detection-results").innerText = "Human Move: " + act_move;

					if (act_move === "thumbsup") {
						document.getElementById("ai-results").innerText = "Game Paused";}
					else {
						// Send move data to Firebase
						const movesRef = ref(database, 'moves');
						push(movesRef, {
							move: act_move,
							timestamp: serverTimestamp()
						});
						
					}
            });
        }, 700);
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
			<h1 className="headline">Rock Paper Scissors</h1>
			<div id = "game">
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
				<div className="frame">
					<div className="webcam-container">
						<img
							src="path_to_your_image.jpg"
							alt="Your Image"
							style={{
								width: '100%',
								height: '100%',
								borderRadius: '10px',
								objectFit: 'cover',
							}}
						/>
					</div>
					<div id="ai-results">
						<p>AI's move: somehow take it from backend</p>
					</div>
				</div>
			</div>
			<div id="score"><h1>Score:</h1><p>Human: 0</p><p>AI: 0</p><p>Thumbsup to restart.</p></div>
		</div>
		</div>
	);
}

export default App;
