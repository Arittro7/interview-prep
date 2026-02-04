import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { useReactMediaRecorder } from 'react-media-recorder';

const CameraRecorder = forwardRef(({ onRecordingComplete }, ref) => {
  const webcamRef = useRef(null);

  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,  
    previewStream,  
    status,         
  } = useReactMediaRecorder({
    video: true,
    audio: false,  
    blobPropertyBag: { type: 'video/webm' },
    onStop: (blobUrl, blob) => {
      console.log('Recording stopped. Status:', status, 'Blob size:', blob.size);
      onRecordingComplete?.(blob);
    },
  });

  // Expose start/stop to parent (Interview.jsx)
  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
  }));

  // Auto-start when component mounts
  useEffect(() => {
    const timer = setTimeout(startRecording, 1500);  
    return () => {
      clearTimeout(timer);
      stopRecording();
    };
  }, []);

  console.log('Recorder status:', status);

  return (
    <div className="relative w-full h-full bg-black">
      <Webcam
        ref={webcamRef}
        audio={false} 
        mirrored={true}  
        videoConstraints={{
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        }}
        stream={previewStream} 
        className="w-full h-full object-cover"
      />
    </div>
  );
});

export default CameraRecorder;