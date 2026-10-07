-- Run once in the database SQL editor. Creates empty tables (no entries).
create table if not exists gifts_bought (
  gift_id text primary key,
  buyer_name text,
  bought_at timestamptz not null default now()
);
create table if not exists wishes (
  id bigint generated always as identity primary key,
  name text not null,
  message text not null,
  emoji text,
  created_at timestamptz not null default now()
);
alter table gifts_bought enable row level security;
alter table wishes enable row level security;
create policy "read bought" on gifts_bought for select using (true);
create policy "insert bought" on gifts_bought for insert with check (true);
create policy "read wishes" on wishes for select using (true);
create policy "insert wishes" on wishes for insert with check (true);
