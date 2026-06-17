create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  team_name text not null default '',
  project_type text not null default '',
  college text not null default '',
  advisor text not null default '',
  year text not null default extract(year from now())::text,
  slogan text not null default '',
  summary text not null default '',
  cover_image text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  theme_config jsonb not null default '{}'::jsonb,
  layout_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null default '',
  role text not null default '',
  class_name text not null default '',
  responsibility text not null default '',
  strength text not null default '',
  avatar_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text not null,
  title text not null default '',
  content text not null default '',
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, section_key)
);

create table if not exists public.generated_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  material_type text not null,
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, material_type)
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  session_id_hash text not null,
  route text not null default '',
  event_type text not null default '',
  feature_key text not null default '',
  material_type text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  app_version text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  session_id_hash text not null,
  feedback_type text not null default '',
  rating text check (rating in ('satisfied', 'neutral', 'unsatisfied') or rating is null),
  reason_tags text[] not null default '{}'::text[],
  message text not null default '',
  contact_optional text not null default '',
  submitted_excerpt text not null default '',
  allow_excerpt_for_improvement boolean not null default false,
  material_type text not null default '',
  status text not null default 'open' check (status in ('open', 'reviewed', 'converted', 'resolved', 'ignored')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.error_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  session_id_hash text not null,
  route text not null default '',
  feature_key text not null default '',
  error_type text not null default '',
  error_message_sanitized text not null default '',
  stack_sanitized text not null default '',
  browser_info text not null default '',
  app_version text not null default '',
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'reviewed', 'resolved', 'ignored')),
  created_at timestamptz not null default now()
);

create table if not exists public.improvement_suggestions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  suggestion_type text not null default '',
  title text not null default '',
  summary text not null default '',
  evidence jsonb not null default '{}'::jsonb,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  affected_feature text not null default '',
  suggested_action text not null default '',
  risk_level text not null default 'L3' check (risk_level in ('L1', 'L2', 'L3', 'L4', 'L5')),
  status text not null default 'open' check (status in ('open', 'accepted', 'deferred', 'resolved', 'task_created', 'ignored')),
  admin_decision text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_action_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  action_type text not null default '',
  target_table text not null default '',
  target_id uuid,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists members_project_id_idx on public.members(project_id);
create index if not exists project_sections_project_id_idx on public.project_sections(project_id);
create index if not exists generated_materials_project_id_idx on public.generated_materials(project_id);
create index if not exists usage_events_created_at_idx on public.usage_events(created_at desc);
create index if not exists user_feedback_created_at_idx on public.user_feedback(created_at desc);
create index if not exists error_logs_created_at_idx on public.error_logs(created_at desc);
create index if not exists improvement_suggestions_created_at_idx on public.improvement_suggestions(created_at desc);

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'projects'
      and constraint_name = 'projects_slug_format_check'
  ) then
    alter table public.projects
      add constraint projects_slug_format_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
  end if;
end $$;

do $$
begin
  update public.improvement_suggestions
  set risk_level = case risk_level
    when 'low' then 'L1'
    when 'medium' then 'L3'
    when 'high' then 'L4'
    else risk_level
  end
  where risk_level in ('low', 'medium', 'high');

  alter table public.improvement_suggestions
    drop constraint if exists improvement_suggestions_risk_level_check;

  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'improvement_suggestions'
      and constraint_name = 'improvement_suggestions_risk_level_l_check'
  ) then
    alter table public.improvement_suggestions
      add constraint improvement_suggestions_risk_level_l_check check (risk_level in ('L1', 'L2', 'L3', 'L4', 'L5'));
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at before update on public.members for each row execute function public.set_updated_at();

drop trigger if exists set_project_sections_updated_at on public.project_sections;
create trigger set_project_sections_updated_at before update on public.project_sections for each row execute function public.set_updated_at();

drop trigger if exists set_generated_materials_updated_at on public.generated_materials;
create trigger set_generated_materials_updated_at before update on public.generated_materials for each row execute function public.set_updated_at();

drop trigger if exists set_user_feedback_updated_at on public.user_feedback;
create trigger set_user_feedback_updated_at before update on public.user_feedback for each row execute function public.set_updated_at();

drop trigger if exists set_improvement_suggestions_updated_at on public.improvement_suggestions;
create trigger set_improvement_suggestions_updated_at before update on public.improvement_suggestions for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.members enable row level security;
alter table public.project_sections enable row level security;
alter table public.generated_materials enable row level security;
alter table public.usage_events enable row level security;
alter table public.user_feedback enable row level security;
alter table public.error_logs enable row level security;
alter table public.improvement_suggestions enable row level security;
alter table public.admin_action_logs enable row level security;

create policy "Public can read published projects"
on public.projects for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Admins can manage projects"
on public.projects for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public can read members of published projects"
on public.members for select
using (exists (select 1 from public.projects p where p.id = members.project_id and (p.status = 'published' or auth.role() = 'authenticated')));

create policy "Admins can manage members"
on public.members for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public can read visible sections of published projects"
on public.project_sections for select
using (
  is_visible = true
  and exists (select 1 from public.projects p where p.id = project_sections.project_id and (p.status = 'published' or auth.role() = 'authenticated'))
);

create policy "Admins can manage sections"
on public.project_sections for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public can read generated materials of published projects"
on public.generated_materials for select
using (exists (select 1 from public.projects p where p.id = generated_materials.project_id and (p.status = 'published' or auth.role() = 'authenticated')));

create policy "Admins can manage generated materials"
on public.generated_materials for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Anonymous can insert usage events"
on public.usage_events for insert
with check (true);

create policy "Admins can read usage events"
on public.usage_events for select
using (auth.role() = 'authenticated');

create policy "Anonymous can insert feedback"
on public.user_feedback for insert
with check (true);

create policy "Admins can manage feedback"
on public.user_feedback for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Anonymous can insert error logs"
on public.error_logs for insert
with check (true);

create policy "Admins can manage error logs"
on public.error_logs for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Admins can manage improvement suggestions"
on public.improvement_suggestions for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Admins can manage admin action logs"
on public.admin_action_logs for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
