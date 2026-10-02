"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Camera, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getApiBase } from "@/lib/api-base";

interface VideoVerificationProps {
  userId?: string;
  onVerified?: () => void;
}

export function VideoVerification({ userId, onVerified }: VideoVerificationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      // Start timer
      let time = 0;
      timerRef.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);
        // Auto-stop after 15 seconds
        if (time >= 15) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      setError("Failed to access camera. Please check permissions.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const uploadAndVerify = async () => {
    if (!recordedVideo) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert blob to File
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      const file = new File([blob], "verification-video.webm", { type: "video/webm" });

      // Upload video first
      const formData = new FormData();
      formData.append("file", file);

      const apiUrl = getApiBase();
      
      // Get auth token
      let authHeader = "";
      try {
        const token = localStorage.getItem("token");
        if (token) {
          authHeader = `Bearer ${token}`;
        }
      } catch {
        // No token available
      }

      const uploadResponse = await fetch(`${apiUrl}/api/upload/video`, {
        method: "POST",
        headers: authHeader ? {
          Authorization: authHeader,
        } : {},
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload video");
      }

      const uploadData = await uploadResponse.json();
      const videoUrl = uploadData.url;

      // Now verify the video
      const verifyResponse = await fetch(`${apiUrl}/api/users/me/verify/video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Verification failed");
      }

      const result = await verifyResponse.json();
      setVerificationResult(result);
      setIsDialogOpen(true);

      if (result.verified && onVerified) {
        onVerified();
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setRecordedVideo(null);
    setVerificationResult(null);
    setError(null);
    setRecordingTime(0);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Verification</CardTitle>
        <CardDescription>
          Record a short video (5-15 seconds) to verify your identity. Please:
        </CardDescription>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <ul className="list-disc list-inside">
            <li>Look directly at the camera</li>
            <li>Speak your name clearly</li>
            <li>Move your head slightly left and right</li>
            <li>Blink naturally</li>
          </ul>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!recordedVideo ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera preview will appear here</p>
                  </div>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    Recording... {recordingTime}s / 15s
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="flex-1">
                  <Video className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                src={recordedVideo}
                controls
                className="w-full h-full object-cover"
              />
            </div>

            {verificationResult && (
              <Alert variant={verificationResult.verified ? "default" : "destructive"}>
                {verificationResult.verified ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">
                      {verificationResult.verified
                        ? "Verification Successful!"
                        : "Verification Failed"}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>Confidence: {Math.round(verificationResult.confidence * 100)}%</p>
                      {verificationResult.livenessScore && (
                        <p>Liveness Score: {Math.round(verificationResult.livenessScore * 100)}%</p>
                      )}
                      {verificationResult.reasons && verificationResult.reasons.length > 0 && (
                        <ul className="list-disc list-inside">
                          {verificationResult.reasons.map((reason: string, idx: number) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="flex-1">
                Record Again
              </Button>
              <Button
                onClick={uploadAndVerify}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit for Verification
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing verification...</span>
              <span>This may take 30-60 seconds</span>
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationResult?.verified
                ? "Verification Complete"
                : "Verification Failed"}
            </DialogTitle>
            <DialogDescription>
              {verificationResult?.verified
                ? "Your video has been verified successfully. Your account is now verified."
                : "Your video verification could not be completed. Please try again."}
            </DialogDescription>
          </DialogHeader>
          {verificationResult && (
            <div className="space-y-2">
              <div className="text-sm space-y-1">
                <p>
                  <strong>Face Detected:</strong>{" "}
                  {verificationResult.faceDetected ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {Math.round(verificationResult.confidence * 100)}%
                </p>
                {verificationResult.livenessScore !== undefined && (
                  <p>
                    <strong>Liveness Score:</strong>{" "}
                    {Math.round(verificationResult.livenessScore * 100)}%
                  </p>
                )}
                {verificationResult.matchWithCNIC !== undefined && (
                  <p>
                    <strong>Matches CNIC:</strong>{" "}
                    {verificationResult.matchWithCNIC ? "Yes" : "No"}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
