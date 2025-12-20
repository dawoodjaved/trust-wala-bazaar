"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Upload, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const steps = [
  "Basic Info",
  "Media",
  "Specifications",
  "Pricing",
  "Publish",
];

export function CreateListingContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    condition: "",
    price: "",
    location: "",
    images: [] as string[],
    specifications: {} as Record<string, string>,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Listing Created!",
      description: "Your listing has been published successfully.",
    });
    router.push("/home");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Upload to storage and get URLs
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex-1 ${idx < steps.length - 1 ? "mr-2" : ""}`}
            >
              <div className="flex items-center">
                <div
                  className={`flex-1 h-2 rounded ${
                    idx <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
                {idx < steps.length - 1 && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      idx < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {steps.map((step, idx) => (
            <span
              key={idx}
              className={idx === currentStep ? "font-semibold text-primary" : "text-muted-foreground"}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobiles">Mobiles</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="cars">Cars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., iPhone 15 Pro Max 256GB"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product in detail..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Province"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Upload Images *</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label>Upload Video (Optional)</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Camera className="h-12 w-12 text-muted-foreground" />
                    <span className="text-sm font-medium">Upload video (max 2 min)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add specifications based on your product category. AI can help auto-fill these.
              </p>
              <Button variant="outline" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Auto-fill with AI
              </Button>
              {/* Dynamic form based on category would go here */}
              <div className="space-y-4">
                <div>
                  <Label>Brand</Label>
                  <Input placeholder="e.g., Apple, Samsung" />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input placeholder="e.g., iPhone 15 Pro Max" />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input type="number" placeholder="2024" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Price (PKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="350000"
                />
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>AI Price Suggestion</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Suggested Range:</span>
                      <span className="font-semibold">PKR 320,000 - 380,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Market Average:</span>
                      <span className="font-semibold">PKR 350,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confidence:</span>
                      <Badge variant="success">85%</Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setFormData({ ...formData, price: "350000" })}
                    >
                      Use Suggestion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-2">Ready to Publish?</h3>
                <p className="text-muted-foreground">
                  Review your listing and click publish to make it live.
                </p>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{formData.title || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{formData.category || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {formData.price ? `PKR ${parseInt(formData.price).toLocaleString()}` : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Images:</span>
                      <span className="font-medium">{formData.images.length} uploaded</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Publish Listing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

