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

  const handleSearch = async () => {
    if (!preview) return;

    setIsOpen(false);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // First, upload the image to get a URL (or use base64)
      // For now, we'll send base64 data
      const response = await fetch(`${apiUrl}/api/search/visual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          imageUrl: preview, // Base64 or URL
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const products = await response.json();
        // Navigate to search results page with products
        const searchParams = new URLSearchParams();
        searchParams.set('visual', 'true');
        searchParams.set('q', 'visual search');
        window.location.href = `/search?${searchParams.toString()}`;
      } else {
        // Fallback: Use dummy data for visual search
        console.warn("Visual search API not available, using dummy data");
        const searchParams = new URLSearchParams();
        searchParams.set('visual', 'true');
        searchParams.set('q', 'electronics');
        window.location.href = `/search?${searchParams.toString()}`;
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.warn('Visual search error (handled gracefully):', error);
      }
      // Fallback: Navigate to search with dummy data
      const searchParams = new URLSearchParams();
      searchParams.set('visual', 'true');
      searchParams.set('q', 'electronics');
      window.location.href = `/search?${searchParams.toString()}`;
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

