# SEFGH Usage Contributions - 3D Activity Visualization

## Overview

A GitHub-style 3D contributions chart for SEFGH that visualizes user activity data as interactive isometric cubes or a 2D heatmap. This feature provides comprehensive statistics including streaks, totals, and averages.

## Features

- **2D/3D View Toggle**: Switch between GitHub-style 2D heatmap and 3D isometric visualization
- **Interactive Tooltips**: Hover over any day to see activity count and date
- **Statistics Cards**: 
  - Total usage count
  - Best day (highest activity)
  - Average per day
  - Longest streak
  - Current streak
- **Mobile Responsive**: Automatically recommends 2D view on mobile devices
- **localStorage Persistence**: Remembers user's view preference
- **GitHub Color Palette**: Uses authentic GitHub contribution colors

## File Structure

```
src/
├── lib/
│   ├── usageStats.js              # Data processing utilities
│   └── mockUsageData.js           # Mock data generators
├── components/
│   └── usage-contributions/
│       ├── UsageContributionsCard.jsx       # Main container component
│       ├── UsageViewToggle.jsx              # 2D/3D toggle buttons
│       ├── UsageIsometricChart.jsx          # 3D isometric chart (obelisk.js)
│       ├── UsageHeatmap2D.jsx               # 2D GitHub-style heatmap
│       ├── UsageContributionsStats.jsx      # Total/average/best day stats
│       └── UsageStreaksStats.jsx            # Streak statistics
└── account-settings/
    └── ActivityTab.jsx                      # Account settings activity tab
public/
└── obelisk.min.js                          # Isometric 3D library
```

## Integration Points

### 1. Profile Page (`src/app/profile/page.js`)

The contributions card is displayed at the bottom of the profile page:

```jsx
import UsageContributionsCard from "@/components/usage-contributions/UsageContributionsCard"

<UsageContributionsCard year={new Date().getFullYear()} />
```

### 2. Account Settings (`src/components/AccountSettingsPanel.jsx`)

Added new "Activity" tab in account settings panel showing the full contributions view.

## Usage

### Basic Usage (Mock Data)

```jsx
import UsageContributionsCard from '@/components/usage-contributions/UsageContributionsCard'

<UsageContributionsCard 
  year={2025}
  title="4,116 SEFGH actions in 2025" // Optional custom title
/>
```

### With Real API Data

**IMPORTANT**: Replace mock data with real API calls:

```jsx
import { useState, useEffect } from 'react'
import UsageContributionsCard from '@/components/usage-contributions/UsageContributionsCard'

function MyComponent() {
  const [activityData, setActivityData] = useState(null)
  
  useEffect(() => {
    async function fetchActivity() {
      const response = await fetch('/api/activity')
      const data = await response.json()
      
      // Transform API response to UsageDay format
      const usageDays = data.grid.flat().map(day => ({
        date: day.date,     // ISO date string: "2025-01-15"
        count: day.count    // Integer activity count
      }))
      
      setActivityData(usageDays)
    }
    
    fetchActivity()
  }, [])
  
  return (
    <UsageContributionsCard 
      year={2025}
      data={activityData}
    />
  )
}
```

## Data Format

The component expects activity data in this format:

```javascript
[
  { date: "2025-01-01", count: 5 },
  { date: "2025-01-02", count: 12 },
  { date: "2025-01-03", count: 0 },
  // ... one entry per day
]
```

## API Integration

### Current API Endpoint: `/api/activity`

The existing `/api/activity/route.js` already provides the necessary data structure:

```javascript
{
  "grid": [
    [ // Each week contains 7 days
      { "date": "2025-01-01", "count": 5, "color": "#26a641", ... },
      // ... 7 days
    ],
    // ... ~52 weeks
  ],
  "stats": {
    "maxCount": 42,
    "totalContributions": 1234,
    "currentStreak": 7,
    "averagePerDay": 3.4,
    "activeDays": 150,
    "totalDays": 365
  }
}
```

To use this API, flatten the grid:

```javascript
const usageDays = data.grid.flat().map(day => ({
  date: day.date,
  count: day.count
}))
```

## Customization

### Colors

Colors are defined in `src/lib/usageStats.js`:

```javascript
export function getContributionColor(count, maxCount) {
  if (count === 0) return '#161b22'    // No activity
  
  const percentage = (count / maxCount) * 100
  
  if (percentage <= 25) return '#0e4429'  // Light green
  if (percentage <= 50) return '#006d32'  // Medium green
  if (percentage <= 75) return '#26a641'  // Bright green
  return '#39d353'                        // Intense green
}
```

### Cube Size & Spacing (3D View)

Edit constants in `UsageIsometricChart.jsx`:

```javascript
const SIZE = 14         // Base size of each cube
const MAX_HEIGHT = 100  // Maximum cube height
const OFFSET_X = 14     // Horizontal spacing
const OFFSET_Y = 14     // Vertical spacing
```

### Canvas Dimensions

```javascript
const [dimensions, setDimensions] = useState({ 
  width: 1000,  // Internal canvas width
  height: 600   // Internal canvas height
})
```

## Mock Data Types

Four mock data generators are available in `src/lib/mockUsageData.js`:

1. **Realistic** (default): Varied activity with streaks and gaps
2. **Minimal**: Only a few days with activity
3. **Empty**: All days with 0 count
4. **High**: Very high activity (50-150 per day)

```javascript
import { getMockUsageData } from '@/lib/mockUsageData'

const data = getMockUsageData('realistic', 2025)
// or: 'minimal', 'empty', 'high'
```

## Dependencies

### Already Installed
- React 19.2.0
- Next.js 16
- shadcn/ui components
- Tailwind CSS

### New Dependencies
- **obelisk.js** (included in `public/obelisk.min.js`)
  - Loaded via `<Script>` tag in `src/app/layout.js`
  - No npm package required

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (2D view recommended)

3D rendering uses HTML5 Canvas and works in all modern browsers.

## Performance

- **2D View**: Lightweight, ~300-400 DOM elements
- **3D View**: Canvas-based, renders ~365 cubes
- **Memory**: ~5-10MB for full year data
- **Render Time**: <100ms on modern hardware

## Accessibility

- Tooltip provides accessible date/count info
- Keyboard navigation support (planned)
- Screen reader support (planned)
- Color blind friendly palette (planned)

## Future Enhancements

- [ ] Real-time data fetching from `/api/activity`
- [ ] Year selector dropdown
- [ ] Activity type filtering (search, chat, API, etc.)
- [ ] Export to image
- [ ] Keyboard navigation
- [ ] Screen reader enhancements
- [ ] Color blind mode
- [ ] Animation on data load
- [ ] Zoom and pan for 3D view

## Troubleshooting

### obelisk.js not loading

Check that:
1. File exists at `public/obelisk.min.js`
2. Script tag is in `src/app/layout.js`:
   ```jsx
   <Script src="/obelisk.min.js" strategy="afterInteractive" />
   ```
3. Wait for `window.obelisk` to be available (component handles this automatically)

### Canvas not rendering

1. Check browser console for errors
2. Ensure canvas ref is attached
3. Verify dimensions are set correctly
4. Check that `weeks` array has data

### Data not displaying

1. Verify data format matches: `{ date: string, count: number }[]`
2. Check that dates are valid ISO strings
3. Ensure at least one day has `count > 0`

### Mobile issues

- 3D view is automatically disabled on mobile (< 768px width)
- Use 2D view for better mobile experience
- Horizontal scrolling is enabled for 2D grid

## Support

For issues or questions:
1. Check console for error messages
2. Verify data format and API responses
3. Ensure all dependencies are installed
4. Check that obelisk.js is loaded

## License

This component is part of the SEFGH project and follows the same license.

## Credits

- **obelisk.js**: Copyright (C) 2012-2016 Max Huang (MIT License)
- **Design Inspiration**: GitHub Contributions Graph
- **3D Isometric View**: Based on isometric-contributions browser extension

---

**Last Updated**: November 26, 2025
**Version**: 1.0.0
