"use client";

import { useState } from "react";
import { useSimpleMode } from "@/lib/store/simple-mode-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck as Shield, Bell, Globe, Eye, Database } from "lucide-react";
import { IconKeycap } from "@/components/ui/icon-keycap";
import { VideoVerification } from "@/components/features/video-verification";
import { CNICUpload } from "@/components/features/cnic-upload";

export function SettingsContent() {
  const { isSimpleMode, toggleSimpleMode, fontSize, setFontSize, highContrast, toggleHighContrast } = useSimpleMode();
  const [language, setLanguage] = useState("en");

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="group">
                  <IconKeycap icon={Shield} size="sm" />
                </div>
                <span>Verification</span>
              </CardTitle>
              <CardDescription>
                Verify your identity to increase trust and safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CNICUpload
                onVerified={() => {
                  console.log("CNIC verified successfully");
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Verification</CardTitle>
              <CardDescription>
                Complete video verification to verify your identity with face recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoVerification
                onVerified={() => {
                  // Refresh user data or show success message
                  console.log("Video verified successfully");
                }}
              />
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="group">
                  <IconKeycap icon={Globe} size="sm" />
                </div>
                <span>Language & Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="group">
                  <IconKeycap icon={Eye} size="sm" />
                </div>
                <span>Accessibility</span>
              </CardTitle>
              <CardDescription>
                Customize the app for better accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="simple-mode">Simple Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Larger fonts and simplified UI
                  </p>
                </div>
                <Switch
                  id="simple-mode"
                  checked={isSimpleMode}
                  onCheckedChange={toggleSimpleMode}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size">Font Size</Label>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                  id="font-size"
                  value={[fontSize]}
                  onValueChange={([value]) => setFontSize(value)}
                  min={12}
                  max={24}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={toggleHighContrast}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

