# 🔔 Notifications System

A complete user-specific notification system integrated into your Next.js application.

## Features

- ✅ **Real-time notifications** with Supabase subscriptions
- ✅ **Bell icon in navbar** with unread count badge
- ✅ **Dropdown notification center** with quick actions
- ✅ **Full notifications page** for viewing all notifications
- ✅ **User-specific** - each user only sees their own notifications
- ✅ **Notification types**: Info, Success, Warning, Error
- ✅ **Mark as read/unread** functionality
- ✅ **Delete notifications** individually or in bulk
- ✅ **Clickable links** to navigate to relevant pages
- ✅ **Time formatting** (relative time display)
- ✅ **Filter notifications** by read/unread status
- ✅ **Responsive design** with beautiful UI

## Database Setup

### Step 1: Run the SQL Migration

Open **Supabase SQL Editor** and run:
```sql
-- See: supabase/notifications-schema.sql
```

This creates:
- `notifications` table
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp triggers

### Step 2: Verify Table Creation

Go to **Table Editor** in Supabase and verify:
- ✅ `notifications` table exists

## Usage

### 1. Access Notifications

**In Navbar:**
- Bell icon appears in the header (authenticated users only)
- Shows unread count badge
- Click to open dropdown notification center

**Full Page:**
- Navigate to `/notifications` for detailed view
- Filter by all/unread/read
- Bulk actions available

### 2. Creating Notifications

#### Method 1: Using Helper Function

```javascript
import { createNotification } from '@/lib/notifications';

// Simple notification
await createNotification(
  userId,
  'Welcome!',
  'Thanks for joining our platform',
  'success'
);

// With link
await createNotification(
  userId,
  'New Feature Available',
  'Check out the API Playground!',
  'info',
  '/playground'
);
```

#### Method 2: Using Templates

```javascript
import { sendNotificationFromTemplate, NotificationTemplates } from '@/lib/notifications';

// API Key created
await sendNotificationFromTemplate(
  userId,
  NotificationTemplates.apiKeyCreated('Production Key')
);

// Rate limit warning
await sendNotificationFromTemplate(
  userId,
  NotificationTemplates.rateLimitWarning(85)
);

// Welcome notification
await sendNotificationFromTemplate(
  userId,
  NotificationTemplates.welcome()
);
```

#### Method 3: Direct Database Insert

```javascript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

await supabase.from('notifications').insert({
  user_id: userId,
  title: 'Custom Notification',
  message: 'Your custom message here',
  type: 'info', // 'info', 'success', 'warning', 'error'
  link: '/optional-link',
});
```

## Notification Types

### Available Types:

1. **`info`** (default)
   - Blue color scheme
   - General information
   - Icon: ℹ

2. **`success`**
   - Green color scheme
   - Successful actions
   - Icon: ✓

3. **`warning`**
   - Yellow color scheme
   - Important alerts
   - Icon: ⚠

4. **`error`**
   - Red color scheme
   - Critical issues
   - Icon: ✕

## API Reference

### Helper Functions

#### `createNotification(userId, title, message, type, link)`
Creates a new notification.

**Parameters:**
- `userId` (string) - User's ID from auth
- `title` (string) - Notification title
- `message` (string) - Notification message
- `type` (string) - Type: 'info', 'success', 'warning', 'error'
- `link` (string, optional) - URL to navigate to

**Returns:** `{ data, error }`

#### `markNotificationAsRead(notificationId)`
Marks a notification as read.

#### `markAllNotificationsAsRead(userId)`
Marks all notifications as read for a user.

#### `deleteNotification(notificationId)`
Deletes a specific notification.

#### `getUnreadNotificationCount(userId)`
Gets the count of unread notifications.

**Returns:** `number`

## Integration Examples

### Example 1: API Key Created

```javascript
// In ApiKeysTab.jsx after creating a key
import { createNotification } from '@/lib/notifications';

const createApiKey = async () => {
  // ... create API key logic
  
  // Send notification
  await createNotification(
    userId,
    'API Key Created',
    `Your API key "${keyName}" has been created successfully.`,
    'success',
    '/playground'
  );
};
```

### Example 2: Rate Limit Warning

```javascript
// In your API monitoring logic
import { createNotification } from '@/lib/notifications';

const checkRateLimit = async (userId, currentUsage, limit) => {
  const percentage = (currentUsage / limit) * 100;
  
  if (percentage >= 80) {
    await createNotification(
      userId,
      'Rate Limit Warning',
      `You have used ${percentage.toFixed(0)}% of your daily quota.`,
      'warning',
      '/playground?tab=limits'
    );
  }
};
```

### Example 3: Welcome New User

```javascript
// In your signup flow
import { sendNotificationFromTemplate, NotificationTemplates } from '@/lib/notifications';

const handleSignup = async (user) => {
  // ... signup logic
  
  // Send welcome notification
  await sendNotificationFromTemplate(
    user.id,
    NotificationTemplates.welcome()
  );
};
```

### Example 4: Error Spike Detection

```javascript
// In your monitoring system
import { createNotification } from '@/lib/notifications';

const detectErrorSpike = async (userId, errorCount) => {
  if (errorCount > 10) {
    await createNotification(
      userId,
      'API Error Spike Detected',
      `Detected ${errorCount} API errors in the last hour. Please check your implementation.`,
      'error',
      '/playground?tab=monitoring'
    );
  }
};
```

## Real-time Updates

The notification system uses **Supabase Real-time** to automatically update:
- New notifications appear instantly
- Read status updates in real-time
- Deleted notifications disappear immediately
- Unread count badge updates automatically

No page refresh needed!

## UI Components

### NotificationBell Component

Used in the Header navbar:

```jsx
import { NotificationBell } from '@/components/NotificationBell';

<NotificationBell userId={user.id} />
```

Features:
- Bell icon with badge
- Dropdown on click
- Last 20 notifications
- Mark all read button
- Real-time updates

### Notifications Page

Full-page view at `/notifications`:

Features:
- All notifications in chronological order
- Filter by all/unread/read
- Bulk actions (mark all read, clear read)
- Individual actions (mark read, delete)
- Beautiful card layout

## Customization

### Styling

The notifications use your existing theme and are fully compatible with dark/light mode.

Colors are defined in the component using:
- `text-{color}-500` for icons
- `bg-{color}-500/10` for backgrounds
- `border-{color}-500/20` for borders

### Adding New Templates

Add to `NotificationTemplates` in `/lib/notifications.js`:

```javascript
export const NotificationTemplates = {
  // ... existing templates
  
  customTemplate: (param) => ({
    title: 'Custom Title',
    message: `Custom message with ${param}`,
    type: 'info',
    link: '/custom-link',
  }),
};
```

### Modifying Icons

Edit the `getNotificationIcon` function in components:

```javascript
const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return '✓';
    case 'warning': return '⚠';
    case 'error': return '✕';
    case 'custom': return '🎉'; // Add custom type
    default: return 'ℹ';
  }
};
```

## Best Practices

### 1. Use Meaningful Titles
```javascript
// Good
"API Key Created"
"Rate Limit Exceeded"

// Bad
"Success"
"Error"
```

### 2. Provide Context in Messages
```javascript
// Good
"Your API key 'Production' has been deleted permanently."

// Bad
"Key deleted."
```

### 3. Use Appropriate Types
```javascript
// Success - for completed actions
type: 'success'

// Warning - for alerts that need attention
type: 'warning'

// Error - for critical issues
type: 'error'

// Info - for general information
type: 'info'
```

### 4. Include Actionable Links
```javascript
// Good - provides action
link: '/playground?tab=limits'

// Less helpful - no action
link: null
```

### 5. Avoid Notification Spam
```javascript
// Implement rate limiting for notifications
const lastNotificationTime = await getLastNotificationTime(userId);
const now = new Date();

if (now - lastNotificationTime > 60000) { // 1 minute
  await createNotification(...);
}
```

## Troubleshooting

### Notifications not appearing

1. **Check database:**
   - Run the SQL migration
   - Verify RLS policies are active

2. **Check user authentication:**
   - Ensure user is logged in
   - Verify `userId` is correct

3. **Check console for errors:**
   - Look for Supabase connection errors
   - Check for RLS policy violations

### Unread count not updating

1. **Check real-time subscription:**
   - Verify Supabase real-time is enabled
   - Check browser console for subscription errors

2. **Hard refresh:**
   - Clear cache and refresh page

### Styling issues

1. **Check Tailwind classes:**
   - Ensure all color utilities are available
   - Verify dark mode compatibility

2. **Check z-index:**
   - Notification dropdown has `z-50`
   - Ensure no overlapping elements

## Database Schema

```sql
notifications (
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → auth.users)
  title: TEXT
  message: TEXT
  type: TEXT (info/success/warning/error)
  is_read: BOOLEAN (default: false)
  link: TEXT (optional)
  created_at: TIMESTAMP
  read_at: TIMESTAMP (auto-set when marked read)
)
```

## Security

- ✅ **Row Level Security (RLS)** enabled
- ✅ Users can only see their own notifications
- ✅ Users cannot access other users' data
- ✅ Automatic user isolation

## Performance

- ✅ Indexed for fast queries
- ✅ Limited to last 20 in dropdown
- ✅ Pagination ready for full page
- ✅ Real-time subscriptions optimized

## Next Steps

1. ✅ Run database migration
2. ✅ Test bell icon in navbar
3. ✅ Create sample notifications
4. ✅ Visit `/notifications` page
5. ✅ Integrate into your workflows

---

**Notifications System Complete! 🎉**

Everything is ready to use. Just run the SQL migration and start sending notifications!
