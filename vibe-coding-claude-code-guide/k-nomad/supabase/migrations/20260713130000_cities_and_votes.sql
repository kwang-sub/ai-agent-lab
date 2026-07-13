create extension if not exists pgcrypto;

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  region text not null,
  budget text not null,
  environment text not null,
  best_season text not null,
  base_likes integer not null default 0 check (base_likes >= 0),
  base_dislikes integer not null default 0 check (base_dislikes >= 0),
  visual text not null,
  mood text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cities_budget_check check (
    budget in ('100만원 이하', '100~200만원', '200만원 이상')
  ),
  constraint cities_region_check check (
    region in ('수도권', '경상도', '전라도', '강원도', '제주도', '충청도')
  ),
  constraint cities_environment_check check (
    environment in ('자연친화', '도심선호', '카페작업', '코워킹 필수')
  ),
  constraint cities_best_season_check check (
    best_season in ('봄', '여름', '가을', '겨울')
  )
);

create table if not exists public.city_votes (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote_type text not null check (vote_type in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, user_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cities_set_updated_at on public.cities;
create trigger cities_set_updated_at
before update on public.cities
for each row execute function public.set_updated_at();

drop trigger if exists city_votes_set_updated_at on public.city_votes;
create trigger city_votes_set_updated_at
before update on public.city_votes
for each row execute function public.set_updated_at();

insert into public.cities (
  name,
  slug,
  region,
  budget,
  environment,
  best_season,
  base_likes,
  base_dislikes,
  visual,
  mood
)
values
  ('서울', 'seoul', '수도권', '200만원 이상', '코워킹 필수', '가을', 0, 0, 'from-slate-950 via-slate-700 to-amber-300', '초연결 대도시'),
  ('부산', 'busan', '경상도', '100~200만원', '카페작업', '여름', 0, 0, 'from-slate-900 via-cyan-800 to-stone-200', '해변 워케이션'),
  ('제주', 'jeju', '제주도', '100~200만원', '자연친화', '봄', 0, 0, 'from-emerald-950 via-teal-800 to-amber-200', '자연 집중 환경'),
  ('강릉', 'gangneung', '강원도', '100~200만원', '카페작업', '여름', 0, 0, 'from-blue-950 via-slate-700 to-stone-200', '동해안 집중'),
  ('대전', 'daejeon', '충청도', '100~200만원', '도심선호', '가을', 0, 0, 'from-zinc-950 via-indigo-900 to-emerald-200', '균형형 거점'),
  ('전주', 'jeonju', '전라도', '100만원 이하', '도심선호', '봄', 0, 0, 'from-stone-950 via-red-950 to-amber-200', '문화와 생활비'),
  ('광주', 'gwangju', '전라도', '100만원 이하', '코워킹 필수', '겨울', 0, 0, 'from-neutral-950 via-purple-950 to-yellow-200', '문화 기반 도시'),
  ('인천', 'incheon', '수도권', '100~200만원', '도심선호', '가을', 0, 0, 'from-slate-950 via-blue-900 to-amber-200', '이동성 중심'),
  ('춘천', 'chuncheon', '강원도', '100만원 이하', '자연친화', '봄', 0, 0, 'from-green-950 via-teal-900 to-sky-200', '호수와 집중')
on conflict (slug) do update set
  name = excluded.name,
  region = excluded.region,
  budget = excluded.budget,
  environment = excluded.environment,
  best_season = excluded.best_season,
  base_likes = excluded.base_likes,
  base_dislikes = excluded.base_dislikes,
  visual = excluded.visual,
  mood = excluded.mood;

alter table public.cities enable row level security;
alter table public.city_votes enable row level security;

drop policy if exists "Cities are viewable by everyone." on public.cities;
create policy "Cities are viewable by everyone." on public.cities
  for select using (true);

drop policy if exists "Users can view their own city votes." on public.city_votes;
create policy "Users can view their own city votes." on public.city_votes
  for select using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own city votes." on public.city_votes;
create policy "Users can create their own city votes." on public.city_votes
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own city votes." on public.city_votes;
create policy "Users can update their own city votes." on public.city_votes
  for update using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own city votes." on public.city_votes;
create policy "Users can delete their own city votes." on public.city_votes
  for delete using ((select auth.uid()) = user_id);

grant select on public.cities to anon, authenticated;
grant select, insert, update, delete on public.city_votes to authenticated;

create or replace function public.get_cities_with_votes()
returns table (
  id uuid,
  name text,
  slug text,
  region text,
  budget text,
  environment text,
  best_season text,
  visual text,
  mood text,
  likes integer,
  dislikes integer,
  user_vote text
)
language sql
security definer
set search_path = public
as $$
  with vote_counts as (
    select
      city_id,
      count(*) filter (where vote_type = 'like')::integer as likes,
      count(*) filter (where vote_type = 'dislike')::integer as dislikes
    from public.city_votes
    group by city_id
  ),
  my_votes as (
    select city_id, vote_type
    from public.city_votes
    where user_id = auth.uid()
  )
  select
    c.id,
    c.name,
    c.slug,
    c.region,
    c.budget,
    c.environment,
    c.best_season,
    c.visual,
    c.mood,
    (c.base_likes + coalesce(vc.likes, 0))::integer as likes,
    (c.base_dislikes + coalesce(vc.dislikes, 0))::integer as dislikes,
    mv.vote_type as user_vote
  from public.cities c
  left join vote_counts vc on vc.city_id = c.id
  left join my_votes mv on mv.city_id = c.id
  order by likes desc, c.name asc;
$$;

grant execute on function public.get_cities_with_votes() to anon, authenticated;
