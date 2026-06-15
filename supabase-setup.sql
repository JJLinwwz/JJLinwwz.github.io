-- 双人小屋 · Supabase 数据库初始化（在 Supabase SQL Editor 里运行一次）



create table if not exists room_live (

  room_id text primary key,

  image text,

  v bigint default 0,

  by_user text,

  role text,

  name text,

  updated_at timestamptz default now()

);



create table if not exists room_persist (

  room_id text primary key,

  image text,

  v bigint default 0,

  by_user text,

  updated_at timestamptz default now()

);



create table if not exists room_strokes (

  id uuid primary key default gen_random_uuid(),

  room_id text not null,

  stroke_data jsonb not null,

  ts bigint not null,

  by_user text,

  role text,

  name text

);

create index if not exists idx_strokes_room_ts on room_strokes(room_id, ts);



create table if not exists room_history (

  id uuid primary key default gen_random_uuid(),

  room_id text not null,

  image text,

  thumb text,

  title text,

  ts bigint,

  by_user text,

  role text,

  name text

);

create index if not exists idx_history_room_ts on room_history(room_id, ts desc);



create table if not exists room_photos (

  id uuid primary key default gen_random_uuid(),

  room_id text not null,

  image text,

  thumb text,

  caption text,

  ts bigint,

  by_user text,

  role text,

  name text

);

create index if not exists idx_photos_room_ts on room_photos(room_id, ts desc);



create table if not exists room_presence (

  room_id text not null,

  user_id text not null,

  name text,

  role text,

  page text,

  ts bigint,

  primary key (room_id, user_id)

);



alter table room_live enable row level security;

alter table room_persist enable row level security;

alter table room_strokes enable row level security;

alter table room_history enable row level security;

alter table room_photos enable row level security;

alter table room_presence enable row level security;



create policy "room_live_all" on room_live for all using (true) with check (true);

create policy "room_persist_all" on room_persist for all using (true) with check (true);

create policy "room_strokes_all" on room_strokes for all using (true) with check (true);

create policy "room_history_all" on room_history for all using (true) with check (true);

create policy "room_photos_all" on room_photos for all using (true) with check (true);

create policy "room_presence_all" on room_presence for all using (true) with check (true);



alter publication supabase_realtime add table room_live;

alter publication supabase_realtime add table room_strokes;

alter publication supabase_realtime add table room_photos;

alter publication supabase_realtime add table room_presence;



create table if not exists room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  type text not null default 'text',
  content text default '',
  media text default '',
  thumb text default '',
  ts bigint not null,
  by_user text,
  role text,
  name text
);

create index if not exists idx_messages_room_ts on room_messages(room_id, ts desc);

alter table room_messages enable row level security;

create policy "room_messages_all" on room_messages for all using (true) with check (true);

alter publication supabase_realtime add table room_messages;

