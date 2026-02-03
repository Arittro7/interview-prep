/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { Button } from './ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './ui/card';
import CameraRecorder from './CameraRecorder';
import AIAnswer from './AIAnswer';

const Interview = () => {
  const {
    currentQuestion,
    nextQuestion,
    toggleMarkQuestion,
    markedQuestions,
    timer,
    endInterview,
  } = useInterview();

  const navigate = useNavigate();
  const cameraRef = useRef(null);

  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Reset reveal state when question changes
  useEffect(() => {
    setIsAnswerRevealed(false);
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleEndInterview = () => {
    // Stop video recording
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }

    endInterview();     // Reset context state
    navigate('/');      // Go back to home
  };

  const handleRecordingComplete = (blob) => {
    if (!blob || blob.size === 0) {
      console.warn('Recording was empty – no file saved');
      // Optional: show user message
      // alert('No recording was captured. Check camera/mic permissions.');
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    // Nice filename with date & time
    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.download = `interview-recording-${dateStr}.webm`;

    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // ─────────────────────────────────────────────────────────────
  // No question available state
  // ─────────────────────────────────────────────────────────────
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          It looks like there are no questions in the database yet, or none match your selected tags.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/add-question')}>
            Add a Question
          </Button>
          <Button onClick={handleEndInterview}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isMarked = markedQuestions.includes(currentQuestion.id);

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Top bar */}
      <div className="flex justify-end mb-6">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleEndInterview}
        >
          End Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left sidebar – Timer + Camera */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Timer card */}
          <div className="bg-card border rounded-xl p-5 text-center shadow-sm">
            <div className="text-4xl font-mono font-bold tracking-wider mb-1">
              {formatTime(timer)}
            </div>
            <div className="text-sm text-muted-foreground">
              Time Elapsed
            </div>
          </div>

          {/* Camera preview */}
          <div className="bg-black rounded-xl overflow-hidden border shadow-md relative">
            <div className="aspect-[4/3] w-full">
              <CameraRecorder
                ref={cameraRef}
                onRecordingComplete={handleRecordingComplete}
              />
            </div>
          </div>
        </div>

        {/* Main question area */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col min-h-[580px] shadow-lg">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex flex-wrap gap-2">
                {currentQuestion.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-muted/70 text-muted-foreground border"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                variant={isMarked ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleMarkQuestion(currentQuestion.id)}
              >
                {isMarked ? 'Marked ✓' : 'Mark for Review'}
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-6 md:p-8 lg:p-10 space-y-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center leading-tight">
                {currentQuestion.title}
              </h2>

              {isAnswerRevealed && (
                <div className="bg-muted/40 p-6 md:p-8 rounded-xl border animate-in fade-in duration-400 whitespace-pre-wrap text-left leading-relaxed">
                  <strong className="block text-lg font-semibold mb-4 text-foreground">
                    Answer:
                  </strong>
                  {currentQuestion.answer}
                </div>
              )}

              <AIAnswer questionTitle={currentQuestion.title} />
            </CardContent>

            <CardFooter className="flex justify-between p-6 md:p-8 bg-muted/10 border-t">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
              >
                {isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}
              </Button>

              <Button
                size="lg"
                onClick={nextQuestion}
              >
                Next Question →
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Interview;