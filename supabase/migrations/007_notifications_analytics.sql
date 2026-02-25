-- ============================================
-- Findr - Push Notifications & Analytics
-- Migration 007
-- ============================================

-- 1. PUSH SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, endpoint)
);

-- 2. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    new_messages BOOLEAN DEFAULT true,
    price_drops BOOLEAN DEFAULT true,
    saved_search_matches BOOLEAN DEFAULT true,
    listing_updates BOOLEAN DEFAULT true,
    marketing BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NOTIFICATIONS QUEUE TABLE
CREATE TABLE IF NOT EXISTS notifications_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('new_message', 'price_drop', 'saved_search_match', 'listing_update', 'system')),
    title VARCHAR NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    url VARCHAR,
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type VARCHAR NOT NULL CHECK (event_type IN (
        'page_view', 'listing_view', 'listing_contact', 'listing_call', 
        'listing_share', 'search', 'user_signup', 'user_login',
        'listing_favorite', 'listing_unfavorite', 'listing_create',
        'click', 'conversion'
    )),
    page_url VARCHAR,
    referrer VARCHAR,
    -- Event specific data
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    search_query TEXT,
    category VARCHAR,
    -- Device/Browser info
    user_agent TEXT,
    device_type VARCHAR CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
    browser VARCHAR,
    os VARCHAR,
    -- Location info (if available)
    country VARCHAR DEFAULT 'CM',
    city VARCHAR,
    -- Performance metrics
    page_load_time INTEGER, -- milliseconds
    -- Additional metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SAVED SEARCHES TABLE
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR NOT NULL,
    query VARCHAR,
    category VARCHAR,
    city VARCHAR,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    filters JSONB DEFAULT '{}',
    notify_new_matches BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MESSAGES TABLE (for notifications)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_system BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_queue_user_status ON notifications_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_queue_scheduled ON notifications_queue(scheduled_for) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_listing ON analytics_events(listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_active ON saved_searches(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_messages_listing ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- RLS (Row Level Security)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Push subscriptions policies
CREATE POLICY "Users can manage their own push subscriptions" ON push_subscriptions
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- Notification preferences policies
CREATE POLICY "Users can manage their own notification preferences" ON notification_preferences
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- Notifications queue policies (users can only read their own)
CREATE POLICY "Users can read their own notifications" ON notifications_queue
    FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications" ON notifications_queue
    FOR ALL TO authenticated USING (
        EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
    );

-- Analytics policies
CREATE POLICY "Service can insert analytics events" ON analytics_events
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can read their own analytics" ON analytics_events
    FOR SELECT TO authenticated USING (
        user_id = auth.uid() OR 
        EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
    );

-- Saved searches policies
CREATE POLICY "Users can manage their own saved searches" ON saved_searches
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read their own messages" ON messages
    FOR SELECT TO authenticated USING (
        sender_id = auth.uid() OR recipient_id = auth.uid()
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own sent messages" ON messages
    FOR UPDATE TO authenticated USING (sender_id = auth.uid());

-- FUNCTIONS for notifications

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id) 
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences on user creation
CREATE TRIGGER trigger_create_notification_preferences
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();

-- Function to queue notifications for new messages
CREATE OR REPLACE FUNCTION queue_message_notification()
RETURNS TRIGGER AS $$
DECLARE
    recipient_name TEXT;
    sender_name TEXT;
    listing_title TEXT;
    prefs RECORD;
BEGIN
    -- Get recipient preferences
    SELECT * INTO prefs FROM notification_preferences 
    WHERE user_id = NEW.recipient_id;
    
    -- Only send if push notifications are enabled for new messages
    IF prefs.new_messages AND prefs.push_notifications THEN
        -- Get names and listing info
        SELECT full_name INTO sender_name FROM profiles WHERE id = NEW.sender_id;
        SELECT full_name INTO recipient_name FROM profiles WHERE id = NEW.recipient_id;
        SELECT title INTO listing_title FROM listings WHERE id = NEW.listing_id;
        
        -- Queue the notification
        INSERT INTO notifications_queue (
            user_id, type, title, body, data, url
        ) VALUES (
            NEW.recipient_id,
            'new_message',
            'Nouveau message',
            COALESCE(sender_name, 'Un utilisateur') || ' vous a envoyé un message concernant "' || COALESCE(listing_title, 'une annonce') || '"',
            jsonb_build_object(
                'message_id', NEW.id,
                'sender_id', NEW.sender_id,
                'listing_id', NEW.listing_id
            ),
            '/dashboard/messages'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for message notifications
CREATE TRIGGER trigger_message_notification
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION queue_message_notification();

-- Function to update analytics view counts
CREATE OR REPLACE FUNCTION increment_listing_views()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_type = 'listing_view' AND NEW.listing_id IS NOT NULL THEN
        UPDATE listings 
        SET views = views + 1, updated_at = NOW()
        WHERE id = NEW.listing_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating view counts
CREATE TRIGGER trigger_increment_views
    AFTER INSERT ON analytics_events
    FOR EACH ROW EXECUTE FUNCTION increment_listing_views();