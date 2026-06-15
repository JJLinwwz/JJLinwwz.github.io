-- 悄悄话聊天 · 在 Supabase SQL Editor 运行一次（若已运行过 supabase-setup.sql）

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

drop policy if exists "room_messages_all" on room_messages;
create policy "room_messages_all" on room_messages for all using (true) with check (true);

alter publication supabase_realtime add table room_messages;
