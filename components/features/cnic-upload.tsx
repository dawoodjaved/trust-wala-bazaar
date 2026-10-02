"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getApiBase } from "@/lib/api-base";

interface CNICUploadProps {
  onVerified?: () => void;
}

export function CNICUpload({ onVerified }: CNICUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setUploadedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

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

      // Upload image first
      const uploadResponse = await fetch(`${apiUrl}/api/upload/image`, {
        method: "POST",
        headers: authHeader ? {
          Authorization: authHeader,
        } : {},
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url;

      // Extract CNIC data using AI
      const extractResponse = await fetch(`${apiUrl}/api/ai/cnic-extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!extractResponse.ok) {
        throw new Error("Failed to extract CNIC data");
      }

      const extractedData = await extractResponse.json();

      // Update user profile with CNIC data
      const updateResponse = await fetch(`${apiUrl}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({
          cnicImage: imageUrl,
          cnicNumber: extractedData.cnicNumber,
          cnicVerified: extractedData.valid || false,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Return verification result
      const result = {
        verified: extractedData.valid || false,
        cnicNumber: extractedData.cnicNumber,
        name: extractedData.name,
        dob: extractedData.dob,
      };
      
      setVerificationResult(result);
      setIsDialogOpen(true);

      if (result.verified && onVerified) {
        onVerified();
      }
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
      console.error("CNIC upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setUploadedFile(null);
    setPreview(null);
    setVerificationResult(null);
    setError(null);
    setIsDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!preview ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-sm text-slate-300 mb-2">
              Upload a clear photo of your CNIC
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Supported formats: JPG, PNG (Max 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border border-slate-700 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="CNIC Preview"
              className="w-full h-auto max-h-64 object-contain"
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
                      ? "CNIC Verified Successfully!"
                      : "CNIC Verification Failed"}
                  </p>
                  {verificationResult.cnicNumber && (
                    <p className="text-sm">
                      CNIC Number: {verificationResult.cnicNumber}
                    </p>
                  )}
                  {verificationResult.name && (
                    <p className="text-sm">Name: {verificationResult.name}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={reset} variant="outline" className="flex-1">
              Choose Different File
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Verify
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationResult?.verified
                ? "CNIC Verification Complete"
                : "CNIC Verification Failed"}
            </DialogTitle>
            <DialogDescription>
              {verificationResult?.verified
                ? "Your CNIC has been verified successfully. Your account is now verified."
                : "Your CNIC verification could not be completed. Please ensure the image is clear and try again."}
            </DialogDescription>
          </DialogHeader>
          {verificationResult && (
            <div className="space-y-2">
              <div className="text-sm space-y-1">
                {verificationResult.cnicNumber && (
                  <p>
                    <strong>CNIC Number:</strong> {verificationResult.cnicNumber}
                  </p>
                )}
                {verificationResult.name && (
                  <p>
                    <strong>Name:</strong> {verificationResult.name}
                  </p>
                )}
                {verificationResult.dob && (
                  <p>
                    <strong>Date of Birth:</strong> {verificationResult.dob}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  {verificationResult.verified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
