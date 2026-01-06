-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Animals Table (Static Data)
create table animals (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null, -- e.g. 'lion', 'elephant'
  name text not null,        -- Display Name
  cost integer not null,     -- Purchase price
  income_rate integer not null, -- Coins per tick (e.g. per minute)
  image_url text,            -- Path to asset
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles Table (User Data - extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  zoo_name text default 'Moje ZOO',
  money integer default 1000, -- Start amount
  last_income_sync timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

-- 3. Zoo Placements (Animals owned by user)
create table zoo_placements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  animal_id uuid references animals(id) on delete cascade not null,
  nickname text, -- Custom name given by kid
  x_pos integer default 0,
  y_pos integer default 0,
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Row Level Security)
alter table animals enable row level security;
alter table profiles enable row level security;
alter table zoo_placements enable row level security;

-- Animals are readable by everyone, modifiable only by admins (service role)
create policy "Animals are viewable by everyone" on animals for select using (true);

-- Profiles are viewable/editable by owner only
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Placements
create policy "Users can view own placements" on zoo_placements for select using (auth.uid() = user_id);
create policy "Users can insert own placements" on zoo_placements for insert with check (auth.uid() = user_id);
create policy "Users can update own placements" on zoo_placements for update using (auth.uid() = user_id);
create policy "Users can delete own placements" on zoo_placements for delete using (auth.uid() = user_id);

-- Initial Data (Seeding) - Placeholder Animals
insert into animals (slug, name, cost, income_rate) values
('dog', 'Pejsek', 100, 5),
('cat', 'Kočička', 150, 8),
('elephant', 'Slon', 500, 30),
('lion', 'Lev', 800, 50),
('penguin', 'Tučňák', 300, 20);
