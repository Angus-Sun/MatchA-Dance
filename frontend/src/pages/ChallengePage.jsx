import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import Leaderboard from "../components/Leaderboard.jsx";

export default function ChallengePage() {
  const { id } = useParams(); // challenge ID
  const [challenge, setChallenge] = useState(null);
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);

  // Webcam recording refs/states
  const videoRef = useRef(null); // live webcam feed
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    fetchChallenge();
    startCamera();
  }, []);

  const fetchChallenge = async () => {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error(error);
    else setChallenge(data);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  };

  const startRecording = () => {
    chunksRef.current = [];
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // Play original challenge video alongside the live webcam feed
  const playBothLive = async () => {
    if (!challengeVideoRef.current || !videoRef.current) return;
    try {
      challengeVideoRef.current.currentTime = 0;
      // Ensure webcam element is playing
      if (videoRef.current.paused) {
        await videoRef.current.play();
      }
      await challengeVideoRef.current.play();
    } catch (err) {
      console.warn("Live dual playback failed:", err);
    }
  };

  // (Sync playback moved to Leaderboard replays view)

  const handleUploadMimic = async () => {
    if (!recordedBlob || !username) return alert("Enter your name and record a video first!");

    setUploading(true);
    const fileName = `mimics/${uuidv4()}.webm`;

    // Upload mimic video
    const { data, error: uploadError } = await supabase.storage
      .from("videos")
      .upload(fileName, recordedBlob, { contentType: "video/webm" });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("videos")
      .getPublicUrl(data.path);

    // Insert into scores table
    const { error: dbError } = await supabase
      .from("scores")
      .insert([{
        challenge_id: id,
        player: username,
        score: Math.random() * 100, // placeholder for pose similarity later
        mimic_url: publicData.publicUrl
      }]);

    if (dbError) alert("Error saving score: " + dbError.message);
    else alert("Mimic uploaded successfully!");

    setUploading(false);
  };

  if (!challenge) return <p>Loading...</p>;

  return (
    <div>
      <h1>{challenge.title}</h1>
      <p>Original by: {challenge.uploader}</p>

      <div style={{ display: "flex", gap: "20px" }}>
  <video src={challenge.video_url} controls width="300" />
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <video ref={videoRef} autoPlay playsInline muted width="300" />
          <div>
            {!recording ? (
              <button onClick={startRecording}>🎥 Start Recording</button>
            ) : (
              <button onClick={stopRecording}>⏹ Stop Recording</button>
            )}
          </div>

          {recordedBlob && (
            <div>
              <h4>Preview Recording:</h4>
              <video src={URL.createObjectURL(recordedBlob)} controls width="300" />
              <div style={{ marginTop: "8px" }}>
                <button disabled={uploading} onClick={handleUploadMimic}>
                  {uploading ? "Uploading..." : "Upload Mimic"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {challenge && <Leaderboard challenge={challenge} />}
    </div>
  );
}
