// ==========================================
// SIGN BRIDGE
// CAMERA + HAND LANDMARK DETECTION
// ==========================================


// ------------------------------------------
// Start Communication
// ------------------------------------------

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function () {

    document.getElementById("communication").scrollIntoView({
        behavior: "smooth"
    });

});


// ------------------------------------------
// Camera Elements
// ------------------------------------------

const cameraButton = document.getElementById("cameraButton");

const cameraVideo = document.getElementById("cameraVideo");

const handCanvas = document.getElementById("handCanvas");

const canvasContext = handCanvas.getContext("2d");


// ------------------------------------------
// MediaPipe Hands
// ------------------------------------------

const hands = new Hands({

    locateFile: function (file) {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }

});


// MediaPipe settings

hands.setOptions({

    maxNumHands: 2,

    modelComplexity: 1,

    minDetectionConfidence: 0.5,

    minTrackingConfidence: 0.5

});


// ------------------------------------------
// Draw Hand Landmarks
// ------------------------------------------

hands.onResults(function (results) {

    canvasContext.save();

    canvasContext.clearRect(
        0,
        0,
        handCanvas.width,
        handCanvas.height
    );


    if (results.multiHandLandmarks) {

        for (const landmarks of results.multiHandLandmarks) {
            // Collect landmark data
if (collectingData) {

    const sample = [];

    for (const landmark of landmarks) {

        sample.push(landmark.x);
        sample.push(landmark.y);
        sample.push(landmark.z);

    }

    collectedSamples.push(sample);

    collectionStatus.textContent =
        "Collecting " +
        signSelect.value +
        " samples: " +
        collectedSamples.length;
}
collectSequenceFrame(landmarks);
// ------------------------------------------
// LIVE MODEL FRAME COLLECTION
// ------------------------------------------

const predictionFrame = [];

for (const landmark of landmarks) {

    predictionFrame.push(landmark.x);
    predictionFrame.push(landmark.y);
    predictionFrame.push(landmark.z);

}

predictionFrames.push(predictionFrame);


// Keep only the latest 20 frames

if (predictionFrames.length > MODEL_FRAMES) {

    predictionFrames.shift();

}


// When 20 frames are ready, predict

if (predictionFrames.length === MODEL_FRAMES) {

    sendSequenceToModel();

}
            // Draw connections

            drawConnectors(
                canvasContext,
                landmarks,
                HAND_CONNECTIONS,
                {
                    color: "#00FF00",
                    lineWidth: 3
                }
            );


            // Draw points

            drawLandmarks(
                canvasContext,
                landmarks,
                {
                    color: "#FF0000",
                    lineWidth: 2
                }
            );

        }

    }

    canvasContext.restore();

});


// ------------------------------------------
// Start Camera
// ------------------------------------------

cameraButton.addEventListener("click", async function () {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: false

            });


        cameraVideo.srcObject = stream;


        cameraVideo.onloadedmetadata = function () {

            handCanvas.width = cameraVideo.videoWidth;

            handCanvas.height = cameraVideo.videoHeight;

        };


        cameraButton.textContent = "Camera Running";


        // Start MediaPipe

        const camera = new Camera(

            cameraVideo,

            {

                onFrame: async function () {

                    await hands.send({

                        image: cameraVideo

                    });

                },

                width: 640,

                height: 480

            }

        );


        camera.start();


    } catch (error) {

        console.error("Camera Error:", error);

        alert(
            "Camera Error: " + error.message
        );

    }

});

// ==========================================
// SIGN DATA COLLECTION
// ==========================================

const signSelect = document.getElementById("signSelect");

const collectButton =
    document.getElementById("collectButton");

const collectionStatus =
    document.getElementById("collectionStatus");


let collectingData = false;

let collectedSamples = [];


// Start collecting

collectButton.addEventListener("click", function () {

    if (!collectingData) {

        collectingData = true;

        collectedSamples = [];

        collectButton.textContent =
            "Stop Collecting";

        collectionStatus.textContent =
            "Collecting data... Show the selected sign.";

    }

    else {

        collectingData = false;

        collectButton.textContent =
            "Start Collecting";

        collectionStatus.textContent =
            "Collected " +
            collectedSamples.length +
            " samples.";

    }

});


// ==========================================
// DOWNLOAD DATASET
// ==========================================

const downloadButton =
    document.getElementById("downloadButton");


downloadButton.addEventListener("click", function () {

    if (collectedSamples.length === 0) {

        alert("No data collected yet.");

        return;
    }


    let csv = "";

    // Create header

    csv += "label";

    for (let i = 1; i <= 63; i++) {

        csv += ",feature_" + i;

    }

    csv += "\n";


    // Add samples

    for (const sample of collectedSamples) {

        csv += signSelect.value;

        for (const value of sample) {

            csv += "," + value;

        }

        csv += "\n";

    }


    // Create file

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        signSelect.value + "_dataset.csv";


    link.click();


    URL.revokeObjectURL(url);

});

// ==========================================
// SIGN BRIDGE - SEQUENCE DATA COLLECTION
// ==========================================


// ------------------------------------------
// Sequence Collection Elements
// ------------------------------------------

const sequenceSignSelect =
    document.getElementById("sequenceSignSelect");

const sequenceButton =
    document.getElementById("sequenceButton");

const sequenceStatus =
    document.getElementById("sequenceStatus");

const sequenceCount =
    document.getElementById("sequenceCount");

const downloadSequenceButton =
    document.getElementById("downloadSequenceButton");


// ------------------------------------------
// Sequence Settings
// ------------------------------------------

const FRAMES_PER_SEQUENCE = 20;


// ------------------------------------------
// Variables
// ------------------------------------------

let collectingSequence = false;

let currentSequence = [];

let sequenceDataset = [];


// ------------------------------------------
// Start Sequence Collection
// ------------------------------------------

sequenceButton.addEventListener("click", function (event) {

    event.preventDefault();

    collectingSequence = true;

    currentSequence = [];

    sequenceButton.textContent = "Collecting...";

    sequenceStatus.textContent =
        "TEST: Sequence collection started!";

    console.log("SEQUENCE COLLECTION STARTED");

});

        

    



// ------------------------------------------
// Collect Landmark Frames
// ------------------------------------------
//
// IMPORTANT:
// This function is called from the
// MediaPipe results function.
// ------------------------------------------

function collectSequenceFrame(landmarks) {

    if (!collectingSequence) {
        return;
    }

    const frame = [];

    // Collect 21 hand landmarks
    for (const landmark of landmarks) {

        frame.push(landmark.x);
        frame.push(landmark.y);
        frame.push(landmark.z);

    }

    // Add this frame to the current sequence
    currentSequence.push(frame);

    // Show progress
    sequenceStatus.textContent =
        "Recording frame " +
        currentSequence.length +
        " / " +
        FRAMES_PER_SEQUENCE;


    // When 20 frames are collected
    if (currentSequence.length >= FRAMES_PER_SEQUENCE) {

        const flattenedSequence =
            currentSequence.flat();

        sequenceDataset.push({

            label: sequenceSignSelect.value,

            features: flattenedSequence

        });

        // Reset for next sequence
        collectingSequence = false;

        currentSequence = [];

        sequenceButton.textContent =
            "Start Sequence";

        sequenceStatus.textContent =
            "Sequence saved successfully!";

        sequenceCount.textContent =
            "Sequences collected: " +
            sequenceDataset.length;

    }

}


// ------------------------------------------
// Download Sequence Dataset
// ------------------------------------------

downloadSequenceButton.addEventListener(
    "click",
    function () {

        if (sequenceDataset.length === 0) {

            alert(
                "No sequence data collected yet."
            );

            return;

        }


        let csv = "";


        // ----------------------------------
        // Create header
        // ----------------------------------

        csv += "label";


        const totalFeatures =
            FRAMES_PER_SEQUENCE * 63;


        for (
            let i = 1;
            i <= totalFeatures;
            i++
        ) {

            csv += ",feature_" + i;

        }


        csv += "\n";


        // ----------------------------------
        // Add sequences
        // ----------------------------------

        for (
            const sequence
            of sequenceDataset
        ) {

            csv += sequence.label;


            for (
                const value
                of sequence.features
            ) {

                csv += "," + value;

            }


            csv += "\n";

        }


        // ----------------------------------
        // Create CSV file
        // ----------------------------------

        const blob = new Blob(

            [csv],

            {
                type: "text/csv"
            }

        );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            "sign_sequence_dataset.csv";


        link.click();


        URL.revokeObjectURL(url);


        sequenceStatus.textContent =
            "Sequence dataset downloaded!";

    }
);

// ==========================================
// SIGN BRIDGE - LIVE ML PREDICTION
// ==========================================

// Number of frames required by our model
const MODEL_FRAMES = 20;

// Store frames for prediction
let predictionFrames = [];
let predictionInProgress = false;


// ------------------------------------------
// Send 20 frames to Flask
// ------------------------------------------

async function sendSequenceToModel() {

    // Make sure we have exactly 20 frames and no prediction currently in progress
    if (predictionFrames.length !== MODEL_FRAMES || predictionInProgress) {
        return;
    }

    predictionInProgress = true;

    // Combine all frames into one array
    const features = predictionFrames.flat();

    console.log("Sending sequence to model...");

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    features: features
                })
            }
        );


        const result = await response.json();


        console.log("Model result:", result);


        if (result.success) {

    console.log(
        "Detected Sign:",
        result.prediction
    );


    const detectedSign =
        document.querySelector(".detected-sign");


    if (detectedSign) {

        detectedSign.textContent =
            result.prediction;

    }


    // Speak the detected sign

    speakSign(result.prediction);

}

        else {

            console.error(
                "Prediction error:",
                result.error
            );

        }

    }

    catch (error) {

        console.error(
            "Backend connection error:",
            error
        );

    }


    // Clear frames after prediction
    // Clear frames after prediction
predictionFrames = [];

predictionInProgress = false;

}

// ==========================================
// SIGN BRIDGE - TEXT TO SPEECH
// ==========================================
let lastSpokenSign = "";
let lastSpokenTime = 0;

const SPEECH_COOLDOWN = 2000;
function speakSign(sign) {const currentTime = Date.now();

if (
    sign === lastSpokenSign &&
    currentTime - lastSpokenTime < SPEECH_COOLDOWN
) {

    return;

}

lastSpokenSign = sign;
lastSpokenTime = currentTime;

    let speechText = "";


    if (sign === "HELLO") {

        speechText = "Hello";

    }

    else if (sign === "THANK_YOU") {

        speechText = "Thank you";

    }

    else if (sign === "YES") {

        speechText = "Yes";

    }

    else if (sign === "NO") {

        speechText = "No";

    }

    else {

        speechText = sign;

    }


    const speech =
        new SpeechSynthesisUtterance(speechText);


    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 1;


    window.speechSynthesis.speak(speech);

}