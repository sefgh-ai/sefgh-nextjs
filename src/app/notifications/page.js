'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Search,
  Inbox,
  Bookmark,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('inbox'); // 'inbox', 'saved', 'done'
  const [readFilter, setReadFilter] = useState('all'); // 'all', 'unread'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [doneIds, setDoneIds] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      loadSavedState();
    }
  }, [user, filter, readFilter, searchQuery]);

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(`notifications_saved_${user.id}`);
      const done = localStorage.getItem(`notifications_done_${user.id}`);
      if (saved) setSavedIds(JSON.parse(saved));
      if (done) setDoneIds(JSON.parse(done));
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply read filter
      if (readFilter === 'unread') {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Apply category filter
      if (filter === 'saved') {
        filteredData = filteredData.filter(n => savedIds.includes(n.id));
      } else if (filter === 'done') {
        filteredData = filteredData.filter(n => doneIds.includes(n.id));
      } else {
        // Inbox - exclude done
        filteredData = filteredData.filter(n => !doneIds.includes(n.id));
      }

      // Apply search
      if (searchQuery) {
        filteredData = filteredData.filter(n =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setNotifications(filteredData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(`notifications_${key}_${user.id}`, JSON.stringify(value));
  };

  const markAsRead = async (notificationIds) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', ids);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (ids.includes(n.id) ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setSelectedIds(prev => prev.filter(id => id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const toggleSaved = (notificationId) => {
    const newSaved = savedIds.includes(notificationId)
      ? savedIds.filter(id => id !== notificationId)
      : [...savedIds, notificationId];
    setSavedIds(newSaved);
    saveToLocalStorage('saved', newSaved);
  };

  const toggleDone = (notificationId) => {
    const newDone = doneIds.includes(notificationId)
      ? doneIds.filter(id => id !== notificationId)
      : [...doneIds, notificationId];
    setDoneIds(newDone);
    saveToLocalStorage('done', newDone);
    
    // Auto mark as read when marking done
    if (!doneIds.includes(notificationId)) {
      markAsRead(notificationId);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'read':
        markAsRead(selectedIds);
        setSelectedIds([]);
        break;
      case 'done':
        selectedIds.forEach(id => {
          if (!doneIds.includes(id)) {
            toggleDone(id);
          }
        });
        setSelectedIds([]);
        break;
      case 'delete':
        selectedIds.forEach(id => deleteNotification(id));
        setSelectedIds([]);
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const inboxCount = notifications.filter(n => !doneIds.includes(n.id)).length;
  const savedCount = savedIds.length;
  const doneCount = doneIds.length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 space-y-2">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {/* Filters */}
        <Button
          variant={filter === 'inbox' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setFilter('inbox')}
        >
          <Inbox className="h-4 w-4 mr-2" />
          Inbox
          {inboxCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {inboxCount}
            </Badge>
          )}
        </Button>

        <Button
          variant={filter === 'saved' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setFilter('saved')}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Saved
          {savedCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {savedCount}
            </Badge>
          )}
        </Button>

        <Button
          variant={filter === 'done' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setFilter('done')}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Done
          {doneCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {doneCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="p-4 space-y-4">
            {/* Search and Actions */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('read')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('done')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Done
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds([])}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {unreadCount > 0 && selectedIds.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4">
              <Button
                variant={readFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setReadFilter('all')}
              >
                All
              </Button>
              <Button
                variant={readFilter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setReadFilter('unread')}
              >
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {loadingNotifications ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {filter === 'saved' ? 'No saved notifications' : 
                 filter === 'done' ? 'No completed notifications' : 
                 'No notifications'}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery ? 'No notifications match your search.' :
                 filter === 'saved' ? 'Save important notifications to access them later.' :
                 filter === 'done' ? 'Mark notifications as done to keep your inbox clean.' :
                 'You\'re all caught up! Check back later for updates.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors group',
                    !notification.is_read && 'bg-primary/5 border-l-2 border-l-primary'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds([...selectedIds, notification.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== notification.id));
                        }
                      }}
                      className="mt-1"
                    />

                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border',
                        getNotificationColor(notification.type)
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.created_at)}
                            </span>
                            {notification.link && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs text-primary"
                                onClick={() => router.push(notification.link)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaved(notification.id)}
                            title={savedIds.includes(notification.id) ? 'Unsave' : 'Save'}
                          >
                            <Bookmark 
                              className={cn(
                                'h-4 w-4',
                                savedIds.includes(notification.id) && 'fill-current text-primary'
                              )} 
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDone(notification.id)}
                            title={doneIds.includes(notification.id) ? 'Unmark done' : 'Mark done'}
                          >
                            <CheckCircle2 
                              className={cn(
                                'h-4 w-4',
                                doneIds.includes(notification.id) && 'fill-current text-green-500'
                              )} 
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
