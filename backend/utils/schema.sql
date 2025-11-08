-- Challenge videos
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text,
  uploader text,
  video_url text,
  created_at timestamp default now()
);

-- Player scores
create table scores (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id),
  player text,
  score float,
  mimic_url text,
  created_at timestamp default now()
);