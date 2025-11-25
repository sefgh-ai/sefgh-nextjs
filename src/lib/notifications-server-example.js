// Example API route showing how to send notifications
// This is a reference example - adapt to your needs

import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
// Make sure to use this in API routes, not client-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key for admin access
);

/**
 * Helper function to send notification from server-side
 */
async function sendNotification(userId, title, message, type = 'info', link = null) {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { data: null, error };
  }
}

// Example: API route to handle some action and send notification
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    // Your business logic here
    // ...

    // Send notification based on action
    switch (action) {
      case 'api_key_created':
        await sendNotification(
          userId,
          'API Key Created',
          'Your new API key has been generated successfully.',
          'success',
          '/playground'
        );
        break;

      case 'rate_limit_warning':
        await sendNotification(
          userId,
          'Rate Limit Warning',
          'You have used 80% of your daily API quota.',
          'warning',
          '/playground?tab=limits'
        );
        break;

      case 'error_detected':
        await sendNotification(
          userId,
          'Error Detected',
          'An error was detected in your recent API calls.',
          'error',
          '/playground?tab=monitoring'
        );
        break;

      default:
        await sendNotification(
          userId,
          'System Notification',
          'A system event has occurred.',
          'info'
        );
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Example: Scheduled job to check and send notifications
export async function checkAndSendNotifications() {
  try {
    // Get all users who need notifications
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('*');

    for (const user of users) {
      // Check user's API usage
      const { data: logs } = await supabaseAdmin
        .from('api_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get user's limits
      const { data: limits } = await supabaseAdmin
        .from('api_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (logs && limits) {
        const usage = logs.length;
        const limit = limits.rate_limit_per_day;
        const percentage = (usage / limit) * 100;

        // Send warning at 80%
        if (percentage >= 80 && percentage < 90) {
          await sendNotification(
            user.id,
            'Rate Limit Warning',
            `You have used ${percentage.toFixed(0)}% of your daily API quota.`,
            'warning',
            '/playground?tab=limits'
          );
        }
        
        // Send critical alert at 90%
        if (percentage >= 90) {
          await sendNotification(
            user.id,
            'Rate Limit Critical',
            `You have used ${percentage.toFixed(0)}% of your daily API quota. Service may be throttled.`,
            'error',
            '/playground?tab=limits'
          );
        }
      }
    }
  } catch (error) {
    console.error('Error in notification job:', error);
  }
}

// Example: Function to notify users about new features
export async function notifyAllUsers(title, message, type = 'info', link = null) {
  try {
    const { data: users } = await supabaseAdmin
      .from('auth.users')
      .select('id');

    const notifications = users.map(user => ({
      user_id: user.id,
      title,
      message,
      type,
      link,
    }));

    const { error } = await supabaseAdmin
      .from('notifications')
      .insert(notifications);

    if (error) throw error;
    
    console.log(`Sent notification to ${users.length} users`);
  } catch (error) {
    console.error('Error notifying all users:', error);
  }
}

// Example usage in your API routes:
/*

// In your API key creation route:
import { sendNotification } from '@/lib/notifications-server';

export async function POST(request) {
  const { userId, keyName } = await request.json();
  
  // Create API key
  const apiKey = await createApiKey(userId, keyName);
  
  // Send notification
  await sendNotification(
    userId,
    'API Key Created',
    `Your API key "${keyName}" has been created successfully.`,
    'success',
    '/playground'
  );
  
  return Response.json({ apiKey });
}

// In a monitoring cron job:
import { checkAndSendNotifications } from '@/lib/notifications-server';

export async function GET() {
  await checkAndSendNotifications();
  return Response.json({ success: true });
}

// To announce a new feature:
import { notifyAllUsers } from '@/lib/notifications-server';

await notifyAllUsers(
  'New Feature: API Testing',
  'Check out our new API testing interface in the playground!',
  'info',
  '/playground?tab=testing'
);

*/
