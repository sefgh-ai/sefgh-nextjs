'use client';

import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';

export default function SessionsTab() {
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    // Fetch session info (would use IP geolocation API)
    setCurrentSession({
      city: 'Secunderabad',
      region: 'Telangana',
      country: 'IN',
      timezone: 'Asia/Kolkata',
      ip: '2405:201:c401:181d:68cd:3bd0:e805:61ba'
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Your sessions</h2>
        <p className="text-sm text-muted-foreground">Manage your active sessions below.</p>
      </div>

      {/* Current Session */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current session</h3>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {/* Map Placeholder */}
          <div className="h-48 bg-gradient-to-b from-muted to-background flex flex-col items-center justify-center">
            <Monitor className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">{currentSession?.city}, {currentSession?.country}</p>
          </div>

          {/* Session Details */}
          {currentSession && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">City: </span>
                  <span className="text-sm text-foreground">{currentSession.city}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Region: </span>
                  <span className="text-sm text-foreground">{currentSession.region}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Country: </span>
                  <span className="text-sm text-foreground">{currentSession.country}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Timezone: </span>
                  <span className="text-sm text-foreground">{currentSession.timezone}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm font-medium text-muted-foreground">IP Address: </span>
                <span className="text-xs font-mono text-muted-foreground select-all">
                  {currentSession.ip}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active sessions</h3>
        <div className="p-12 bg-muted/50 border border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">No other active sessions found.</p>
        </div>
      </div>
    </div>
  );
}
