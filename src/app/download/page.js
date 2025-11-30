'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Apple, Monitor, Smartphone, Chrome, Download, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function DownloadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleDownload = (platform) => {
    toast.success(`Download started for ${platform}`, {
      description: 'This is a preview. Actual downloads will be available soon.',
      duration: 3000,
    });
  };

  const handleWaitlist = () => {
    toast.info('Added to waitlist!', {
      description: 'We\'ll notify you when the browser extension is available.',
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const downloadOptions = [
    {
      title: 'Desktop App',
      description: 'Search GitHub repositories on your desktop with powerful AI',
      icon: Monitor,
      buttons: [
        { 
          text: 'Download for Mac', 
          icon: Apple, 
          variant: 'default',
          onClick: () => handleDownload('macOS')
        },
        { 
          text: 'Download for Windows', 
          icon: Monitor, 
          variant: 'default',
          onClick: () => handleDownload('Windows')
        },
      ],
      features: ['Offline search', 'Native performance', 'System integration'],
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'iOS & Android',
      description: 'Take the GitHub search experience on the go',
      icon: Smartphone,
      buttons: [
        { 
          text: 'Download on Mobile', 
          icon: Smartphone, 
          variant: 'default',
          onClick: () => handleDownload('Mobile')
        },
      ],
      features: ['Touch optimized', 'Offline mode', 'Push notifications'],
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Browser Extension',
      description: 'Integrate SEFGH directly into your browser workflow',
      icon: Chrome,
      buttons: [
        { 
          text: 'Join the Waitlist', 
          icon: Chrome, 
          variant: 'outline',
          onClick: handleWaitlist
        },
      ],
      features: ['Quick access', 'Context menu', 'Tab integration'],
      color: 'from-green-500/20 to-emerald-500/20',
      comingSoon: true
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background gradient-mesh">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/home')}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium mb-4">
            <Download className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Available on Multiple Platforms</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Use SEFGH Anywhere
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
              You Ask Questions
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access powerful GitHub repository search and AI-powered insights across all your devices
          </p>
        </div>

        {/* Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {downloadOptions.map((option, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden glass-premium border-border hover:border-primary/50 transition-all duration-500 hover:shadow-premium-lg"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Coming Soon Badge */}
              {option.comingSoon && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary">
                    Coming Soon
                  </div>
                </div>
              )}

              <div className="relative z-10 p-6 flex flex-col h-full">
                {/* Icon with Float Animation */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="relative p-4 glass rounded-2xl animate-float">
                      <option.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6 flex-grow">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {option.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3 w-3 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 mt-auto">
                  {option.buttons.map((button, btnIdx) => (
                    <Button
                      key={btnIdx}
                      variant={button.variant}
                      className="w-full"
                      onClick={button.onClick}
                    >
                      <button.icon className="h-4 w-4 mr-2" />
                      {button.text}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <Card className="glass-premium border-border p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Why Download SEFGH?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Offline Access</h3>
                <p className="text-sm text-muted-foreground">
                  Search and explore repositories even without internet
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Native Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Faster load times and smoother interactions
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Cross-Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Seamless sync across all your devices
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            onClick={() => router.push('/home')}
            className="px-12"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
