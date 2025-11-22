-- seeds/seed_links.sql
INSERT INTO links (code, target_url, total_clicks)
VALUES ('abc1234', 'https://example.com', 5)
ON CONFLICT (code) DO NOTHING;
