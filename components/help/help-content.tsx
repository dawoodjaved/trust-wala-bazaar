"use client";

import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageCircle as MessageSquare,
  BookOpen as Book,
  ShieldCheck as Shield,
  Phone,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconKeycap } from "@/components/ui/icon-keycap";

export function HelpContent() {
  const faqs = [
    {
      question: "How do I verify my account?",
      answer: "You can verify your account by uploading your CNIC and recording a short video verification.",
    },
    {
      question: "How does escrow protection work?",
      answer: "Escrow protection holds your payment until you confirm receipt of the product, ensuring safe transactions.",
    },
    {
      question: "Can I use voice search?",
      answer: "Yes! Click the microphone icon in the search bar and speak your query in Urdu or English.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-[0_14px_40px_rgba(250,204,21,0.7)]">
          <HelpCircle className="h-8 w-8 text-slate-950" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Help Center
        </h1>
        <p className="text-muted-foreground text-lg">
          Get answers to your questions
        </p>
      </motion.div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="faq" className="rounded-lg">FAQ</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg">Contact</TabsTrigger>
          <TabsTrigger value="guides" className="rounded-lg">Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="card-hover border-2 border-transparent hover:border-amber-300/40">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="group">
                      <IconKeycap icon={HelpCircle} size="sm" />
                    </div>
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-hover border-2 border-transparent hover:border-amber-300/40">
              <CardHeader>
                <div className="group mb-2">
                  <IconKeycap icon={Phone} size="sm" />
                </div>
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Call us for immediate assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">+92 300 1234567</p>
                <p className="text-sm text-muted-foreground mt-2">Mon-Fri, 9 AM - 6 PM</p>
              </CardContent>
            </Card>

            <Card className="card-hover border-2 border-transparent hover:border-amber-300/40">
              <CardHeader>
                <div className="group mb-2">
                  <IconKeycap icon={Mail} size="sm" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us an email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">support@trustwalabazaar.com</p>
                <p className="text-sm text-muted-foreground mt-2">We respond within 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <Card className="card-hover border-2 border-transparent hover:border-amber-300/40">
            <CardHeader>
              <div className="group mb-2">
                <IconKeycap icon={Book} size="sm" />
              </div>
              <CardTitle>Getting Started Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Learn how to buy and sell safely on TrustWala Bazaar
              </p>
              <Button className="rounded-xl">Read Guide</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

