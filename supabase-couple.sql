-- 二人小工具 · 心愿清单 / 一百件小事 / 成长记录 / 每日签到
-- 在 Supabase SQL Editor 运行一次（需先有 supabase-setup.sql 的基础配置）

-- 共同心愿清单（旅行 / 美食 / 生活小事）
create table if not exists room_wishes (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  category text not null default 'life',
  title text not null,
  done boolean default false,
  note text default '',
  photo text default '',
  ts bigint not null,
  completed_at bigint,
  by_user text,
  name text
);
create index if not exists idx_wishes_room on room_wishes(room_id, category, ts desc);

-- 我们的一百件小事
create table if not exists room_hundred (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  title text not null,
  done boolean default false,
  note text default '',
  photo text default '',
  sort_order int default 0,
  ts bigint not null,
  completed_at bigint,
  by_user text,
  name text
);
create index if not exists idx_hundred_room on room_hundred(room_id, sort_order, ts);

-- 成长记录簿（长随笔 + 留言互动）
create table if not exists room_growth (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  content text not null,
  ts bigint not null,
  by_user text,
  name text,
  replies jsonb default '[]'::jsonb
);
create index if not exists idx_growth_room on room_growth(room_id, ts desc);

-- 每日签到 / 陪伴打卡
create table if not exists room_checkins (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  check_date text not null,
  mood text default '',
  note text default '',
  photo text default '',
  ts bigint not null,
  by_user text,
  name text,
  unique(room_id, check_date, by_user)
);
create index if not exists idx_checkins_room on room_checkins(room_id, check_date desc);

alter table room_wishes enable row level security;
alter table room_hundred enable row level security;
alter table room_growth enable row level security;
alter table room_checkins enable row level security;

drop policy if exists "room_wishes_all" on room_wishes;
create policy "room_wishes_all" on room_wishes for all using (true) with check (true);

drop policy if exists "room_hundred_all" on room_hundred;
create policy "room_hundred_all" on room_hundred for all using (true) with check (true);

drop policy if exists "room_growth_all" on room_growth;
create policy "room_growth_all" on room_growth for all using (true) with check (true);

drop policy if exists "room_checkins_all" on room_checkins;
create policy "room_checkins_all" on room_checkins for all using (true) with check (true);

alter publication supabase_realtime add table room_wishes;
alter publication supabase_realtime add table room_hundred;
alter publication supabase_realtime add table room_growth;
alter publication supabase_realtime add table room_checkins;
