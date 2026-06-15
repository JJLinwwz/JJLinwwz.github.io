-- 若 room_history / room_persist 显示 RLS「未启用」，在 SQL Editor 运行本文件一次

alter table room_history enable row level security;
alter table room_persist enable row level security;

drop policy if exists "room_history_all" on room_history;
drop policy if exists "room_persist_all" on room_persist;

create policy "room_history_all" on room_history for all using (true) with check (true);
create policy "room_persist_all" on room_persist for all using (true) with check (true);

-- 确认 Realtime 已开启（若报错「已在 publication 中」可忽略）
alter publication supabase_realtime add table room_live;
alter publication supabase_realtime add table room_strokes;
alter publication supabase_realtime add table room_photos;
alter publication supabase_realtime add table room_presence;
