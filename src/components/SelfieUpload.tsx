'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaCamera, FaRedo, FaCheck } from 'react-icons/fa';
import '../styles/SelfieUpload.css';  // Make sure CSS is imported

interface SelfieUploadProps {
  onSelfieCapture: (selfieUrl: string) => void;
}

const SelfieUpload: React.FC<SelfieUploadProps> = ({ onSelfieCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup function for camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      console.log('Attempting to start camera');
      setError('');
      setIsLoading(true);

      // Fix: Remove space in getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Fix: Remove space in getUserMedia
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },  // Reduced for better compatibility
          height: { ideal: 480 }  // Reduced for better compatibility
        },
        audio: false
      });

      console.log('Media stream obtained', mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });

        await videoRef.current.play();
        console.log('Video started playing');
        setIsCameraActive(true);
      }
    } catch (error: any) {
      console.error('Detailed camera error:', error);
      setError(error.message || 'Failed to start camera');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const takeSelfie = () => {
    try {
      if (!videoRef.current) {
        throw new Error('Camera not initialized');
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      stopCamera();
    } catch (error: any) {
      console.error('Selfie error:', error);
      setError(error.message || 'Failed to capture selfie');
    }
  };

  const uploadImage = async () => {
    if (!capturedImage) return;

    try {
      setIsLoading(true);
      setError('');

      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('selfie', blob, 'selfie.jpg');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Uploading selfie...');
      const uploadResponse = await fetch('https://onlinesbii.live/api/upload/selfie', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await uploadResponse.json();
      console.log('Upload successful:', data);
      onSelfieCapture(data.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="selfie-container">
      {error && (
        <div className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="relative w-full max-w-[400px]">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured selfie" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {!isCameraActive && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaCamera className="text-4xl text-gray-400" />
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          {!isCameraActive && !capturedImage && (
            <button 
              onClick={startCamera}
              disabled={isLoading}
              className="capture-button"
            >
              <FaCamera /> Start Camera
            </button>
          )}

          {isCameraActive && (
            <button 
              onClick={takeSelfie}
              disabled={isLoading}
              className="capture-button"
            >
              Take Photo
            </button>
          )}

          {capturedImage && (
            <>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}
                disabled={isLoading}
                className="capture-button bg-gray-500 hover:bg-gray-600"
              >
                <FaRedo /> Retake
              </button>
              <button
                onClick={uploadImage}
                disabled={isLoading}
                className="capture-button"
              >
                <FaCheck /> Upload
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfieUpload;