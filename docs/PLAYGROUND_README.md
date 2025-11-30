# API Playground Setup Guide

## Overview
The API Playground is a comprehensive dashboard for managing API keys, monitoring usage, setting rate limits, and testing API endpoints.

## Features
- 🔑 **API Key Management**: Generate, view, and manage API keys
- 📊 **Usage Analytics**: Track API requests with charts and metrics
- ⚙️ **Rate Limiting**: Configure request limits per minute/hour/day
- 🔍 **Real-time Monitoring**: Live request logs and health metrics
- 🧪 **API Testing**: Test endpoints with request builder and code generation

## Database Setup

### Step 1: Create Database Tables
1. Open your Supabase project dashboard
2. Go to the **SQL Editor**
3. Copy and paste the contents of `supabase/playground-schema.sql`
4. Click **Run** to execute the SQL

This will create:
- `api_keys` table - Stores user API keys
- `api_logs` table - Stores API request logs
- `api_limits` table - Stores rate limiting configuration
- Indexes for performance
- Row Level Security (RLS) policies

### Step 2: Verify Tables
Go to **Table Editor** in Supabase and verify these tables exist:
- ✅ api_keys
- ✅ api_logs
- ✅ api_limits

## Required Dependencies

Make sure you have these packages installed:

```bash
npm install recharts
```

The charts in the Usage tab use Recharts for data visualization.

## Authentication Setup

The Playground page is protected and requires authentication. Users must be logged in to access it.

Make sure your `AuthContext` is properly set up in `src/contexts/AuthContext.js`.

## Usage

### Accessing the Playground
Navigate to `/playground` after logging in.

### Tab Overview

#### 1. API Keys Tab
- **Create**: Generate new API keys with custom names
- **View**: See all your API keys (click eye icon to reveal)
- **Copy**: Easily copy keys to clipboard
- **Delete**: Remove unused keys

#### 2. Usage Tab
- **Time Ranges**: View data for 24h, 7d, 30d, or 90d
- **Stats Cards**: Total requests, success rate, avg response time, cost
- **Charts**: Request timeline, endpoint usage, request distribution
- **Visual Analytics**: Line charts, pie charts, and bar graphs

#### 3. Limits Tab
- **Rate Limits**: Set per-minute, per-hour, and per-day limits
- **Request Size**: Configure max request size in MB
- **Security**: Enable/disable rate limiting, CORS, IP whitelist
- **IP Whitelist**: Add specific IP addresses for restricted access
- **Usage Tracking**: See current usage against limits in real-time

#### 4. Monitoring Tab
- **Real-time Updates**: Auto-refreshing every 5 seconds
- **Health Metrics**: Uptime, latency, error rate, throughput
- **Activity Log**: Last 50 API requests with full details
- **Status Filters**: Filter by all, success, or error requests
- **Status Summary**: Quick overview of successful/failed requests

#### 5. Testing Tab
- **Request Builder**: Test any API endpoint
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Headers & Body**: Configure JSON headers and request body
- **API Key Auth**: Automatically add your API key to requests
- **Response Viewer**: See formatted response, headers, timing
- **Code Examples**: Generate code snippets in cURL, JavaScript, Python

## API Integration

### Using Generated API Keys

Once you create an API key, use it in your requests:

**JavaScript:**
```javascript
fetch('https://your-api.com/endpoint', {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
})
```

**Python:**
```python
import requests

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}
response = requests.get('https://your-api.com/endpoint', headers=headers)
```

**cURL:**
```bash
curl -X GET https://your-api.com/endpoint \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Logging API Requests

To populate the monitoring and usage data, your API should log requests to the `api_logs` table:

```javascript
// Example logging function
async function logApiRequest(userId, method, endpoint, statusCode, responseTime) {
  const { error } = await supabase
    .from('api_logs')
    .insert({
      user_id: userId,
      method,
      endpoint,
      status_code: statusCode,
      response_time: responseTime,
      cost: calculateCost(method, responseTime), // Optional
    });
}
```

## Security Best Practices

1. **Never expose API keys** in client-side code
2. **Rotate keys regularly** - Delete old keys and create new ones
3. **Use IP whitelisting** for production environments
4. **Monitor rate limits** to prevent abuse
5. **Enable CORS** only for trusted domains
6. **Review logs regularly** for suspicious activity

## Troubleshooting

### No data appearing in Usage/Monitoring tabs
- Ensure API requests are being logged to `api_logs` table
- Check that `user_id` matches the logged-in user
- Verify RLS policies are correctly set up

### Cannot create API keys
- Check Supabase connection in `lib/supabase/client.js`
- Verify user is authenticated
- Check browser console for errors

### Charts not rendering
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors
- Verify data format matches expected structure

## Customization

### Changing Rate Limit Defaults
Edit default values in `src/components/playground/LimitsTab.jsx`:
```javascript
const [limits, setLimits] = useState({
  rate_limit_per_minute: 100,  // Change this
  rate_limit_per_hour: 2000,   // Change this
  rate_limit_per_day: 20000,   // Change this
  // ...
});
```

### Adding More Endpoints
To track specific endpoints, add them when logging:
```javascript
await supabase.from('api_logs').insert({
  user_id: userId,
  method: 'POST',
  endpoint: '/api/new-endpoint',  // Your endpoint
  status_code: 200,
  response_time: 150,
});
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify Supabase connection
3. Check RLS policies in Supabase
4. Review the SQL schema setup

## Next Steps

1. ✅ Run the database migration (`playground-schema.sql`)
2. ✅ Install dependencies (`npm install recharts`)
3. ✅ Navigate to `/playground`
4. ✅ Create your first API key
5. ✅ Configure rate limits
6. ✅ Start testing your API endpoints!

---

**Happy Testing! 🚀**
