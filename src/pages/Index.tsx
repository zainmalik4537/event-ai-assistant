
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EventPlanDisplay from "@/components/EventPlanDisplay";

const Index = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: '',
    event_datetime: '',
    location: '',
    guest_count: '',
    budget: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [eventPlan, setEventPlan] = useState(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['event_name', 'event_type', 'event_datetime', 'location', 'guest_count', 'budget'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const message = `Plan my event with these details:
Event Name: ${formData.event_name}
Event Type: ${formData.event_type}
Date & Time: ${formData.event_datetime}
Location: ${formData.location}
Guest Count: ${formData.guest_count}
Budget: ₹${formData.budget}

Please provide a comprehensive event plan including venue suggestions, catering options, promotion plan, logistics checklist, and feedback strategy.`;

      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-dGu8fYtfm13m6xS9nDQKd8oZdXX1fytA'
        },
        body: JSON.stringify({
          user_id: "mdashraf6366304665@gmail.com",
          agent_id: "68697b75f99197894a7d5ece",
          session_id: "68697b75f99197894a7d5ece-hxc83l41qpd",
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate event plan');
      }

      const data = await response.json();
      setEventPlan(data.response || data.message || "Event plan generated successfully!");
      
      toast({
        title: "Success!",
        description: "Your personalized event plan has been generated",
      });
    } catch (error) {
      console.error('Error generating event plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate event plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎯 Smart Event Planning Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This assistant helps you plan your entire event with ease. Just fill in the details below and our intelligent agents will handle venue, catering, logistics, and more.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                📝 Event Details Form
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Please enter the following details to generate your custom event plan.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Name */}
                  <div className="space-y-2">
                    <Label htmlFor="event_name" className="text-sm font-semibold text-gray-700">
                      Event Name *
                    </Label>
                    <Input
                      id="event_name"
                      placeholder="Enter your event name"
                      value={formData.event_name}
                      onChange={(e) => handleInputChange('event_name', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-2">
                    <Label htmlFor="event_type" className="text-sm font-semibold text-gray-700">
                      Event Type *
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('event_type', value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="college-fest">College Fest</SelectItem>
                        <SelectItem value="corporate-meetup">Corporate Meetup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Event Date & Time */}
                  <div className="space-y-2">
                    <Label htmlFor="event_datetime" className="text-sm font-semibold text-gray-700">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Event Date & Time *
                    </Label>
                    <Input
                      id="event_datetime"
                      type="datetime-local"
                      value={formData.event_datetime}
                      onChange={(e) => handleInputChange('event_datetime', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-2">
                    <Label htmlFor="guest_count" className="text-sm font-semibold text-gray-700">
                      Guest Count *
                    </Label>
                    <Input
                      id="guest_count"
                      type="number"
                      placeholder="Expected number of guests"
                      value={formData.guest_count}
                      onChange={(e) => handleInputChange('guest_count', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="budget" className="text-sm font-semibold text-gray-700">
                      Budget (in INR) *
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Your budget in rupees"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Location Preference *
                    </Label>
                    <Textarea
                      id="location"
                      placeholder="Preferred city, venue type, or specific location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating Your Event Plan...</span>
                      </div>
                    ) : (
                      "🚀 Generate My Smart Event Plan"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Output Section */}
          {eventPlan && (
            <div className="mt-12">
              <EventPlanDisplay eventPlan={eventPlan} />
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="bg-gradient-to-br from-purple-100 to-blue-100 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  ✅ Output Formatting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The event plan will be returned in a structured and readable format including:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>📍 Venue Suggestions</li>
                  <li>🍽️ Catering Options</li>
                  <li>📢 Promotion Plan</li>
                  <li>📦 Logistics Checklist</li>
                  <li>📊 Feedback Strategy</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-teal-100 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  🤖 AI-Powered Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Our smart agents analyze your requirements and provide personalized recommendations based on:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>• Event type and scale</li>
                  <li>• Budget optimization</li>
                  <li>• Location preferences</li>
                  <li>• Guest experience</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
