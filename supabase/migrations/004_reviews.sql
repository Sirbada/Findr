-- Reviews and Ratings System Migration
-- Created: 2026-02-08
-- Purpose: Add comprehensive review system with ratings, comments, and helpfulness voting

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_votes INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prevent duplicate reviews from same user for same listing
CREATE UNIQUE INDEX reviews_unique_user_listing 
ON reviews (listing_id, reviewer_id) 
WHERE reviewer_id IS NOT NULL;

-- Index for efficient listing queries
CREATE INDEX idx_reviews_listing_visible 
ON reviews (listing_id) 
WHERE is_hidden = false;

-- Average rating view for listings
CREATE VIEW listing_ratings AS
SELECT 
  listing_id,
  ROUND(AVG(rating)::numeric, 1) as avg_rating,
  COUNT(*) as review_count,
  COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_count
FROM reviews 
WHERE is_hidden = false
GROUP BY listing_id;

-- Review helpfulness tracking
CREATE TABLE review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, voter_id)
);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read visible reviews
CREATE POLICY "Public reviews read" ON reviews 
FOR SELECT USING (is_hidden = false);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated create reviews" ON reviews 
FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND
  auth.uid() IS NOT NULL
);

-- Users can edit their own reviews
CREATE POLICY "Users edit own reviews" ON reviews 
FOR UPDATE USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- Review votes policies
CREATE POLICY "Public review votes read" ON review_votes 
FOR SELECT USING (true);

CREATE POLICY "Authenticated vote on reviews" ON review_votes 
FOR INSERT WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users manage own votes" ON review_votes 
FOR UPDATE USING (auth.uid() = voter_id)
WITH CHECK (auth.uid() = voter_id);

-- Function to update helpful votes count
CREATE OR REPLACE FUNCTION update_review_helpful_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE reviews 
    SET helpful_votes = (
      SELECT COUNT(*) 
      FROM review_votes 
      WHERE review_id = NEW.review_id AND is_helpful = true
    )
    WHERE id = NEW.review_id;
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE reviews 
    SET helpful_votes = (
      SELECT COUNT(*) 
      FROM review_votes 
      WHERE review_id = OLD.review_id AND is_helpful = true
    )
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for helpful votes
CREATE TRIGGER trigger_update_helpful_votes
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_votes();

-- Comments for documentation
COMMENT ON TABLE reviews IS 'User reviews and ratings for marketplace listings';
COMMENT ON TABLE review_votes IS 'Helpfulness voting on reviews';
COMMENT ON VIEW listing_ratings IS 'Aggregated rating data for listings';