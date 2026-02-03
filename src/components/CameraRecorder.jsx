// CameraRecorder.jsx
import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Webcam from "react-webcam";

const CameraRecorder = forwardRef(({ onRecordingComplete }, ref) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: "user",
  };

  useImperativeHandle(ref, () => ({
    startRecording: () => {
      const stream = webcamRef.current?.stream;
      if (!stream || mediaRecorderRef.current) return;

      chunksRef.current = [];

      // Try modern codec first, fallback to basic webm
      let mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8,opus";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      console.log("Using mimeType:", mimeType); // debug

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("ondataavailable → size:", event.data?.size ?? 0);
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
        // Optional: if no chunks after long time, some people add dummy silent data (advanced)
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
      };

      mediaRecorderRef.current.onstop = () => {
        console.log(
          "Recording stopped. Total chunks:",
          chunksRef.current.length,
        );
        if (chunksRef.current.length === 0) {
          console.warn("No chunks collected – recording may be empty");
        }

        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });
        console.log("Final blob size:", blob.size);

        onRecordingComplete?.(blob);
        chunksRef.current = [];
        mediaRecorderRef.current = null;
      };

      try {
        mediaRecorderRef.current.start();
        console.log("Recording started");
      } catch (err) {
        console.error("Failed to start MediaRecorder:", err);
      }
    },

    stopRecording: () => {
      if (
        mediaRecorderRef.current?.state === "recording" ||
        mediaRecorderRef.current?.state === "paused"
      ) {
        mediaRecorderRef.current.stop();
        console.log("Stop called");
      }
    },
  }));

  // Auto-start when stream is ready
  useEffect(() => {
    if (webcamRef.current?.stream) {
      const timer = setTimeout(() => {
        ref.current?.startRecording();
      }, 2500); // increased delay – important!

      return () => {
        clearTimeout(timer);
        ref.current?.stopRecording();
      };
    }
  }, [ref]);

  return (
    <div className="relative w-full h-full bg-black">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full h-full object-cover"
        onUserMediaError={(err) => console.error("Webcam error:", err)}
      />
    </div>
  );
});

export default CameraRecorder;
