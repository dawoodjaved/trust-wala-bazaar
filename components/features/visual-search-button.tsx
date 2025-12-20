"use client";

import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function VisualSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = () => {
    if (preview) {
      // TODO: Implement visual search API call
      // For now, navigate to search with image parameter
      setIsOpen(false);
      // window.location.href = `/search?image=${encodeURIComponent(preview)}`;
      alert("Visual search coming soon! This will use AI to find similar products.");
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 rounded-lg"
        aria-label="Visual search"
      >
        <Camera className="h-4 w-4" strokeWidth={2} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visual Search</DialogTitle>
            <DialogDescription>
              Upload a photo or take a picture to find similar products
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {preview && (
              <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" strokeWidth={2} />
                Upload Photo
              </Button>

              <Button
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" strokeWidth={2} />
                Take Photo
              </Button>
            </div>

            {preview && (
              <Button onClick={handleSearch} className="w-full">
                Search Similar Products
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

