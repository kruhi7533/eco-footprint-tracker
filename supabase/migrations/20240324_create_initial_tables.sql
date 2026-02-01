-- Create profiles table
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    email text,
    joined_date timestamp with time zone default timezone('utc'::text, now()),
    level integer default 1,
    eco_points integer default 0
);

-- Create baseline emissions table
create table user_baselines (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    transportation_emissions float not null default 0,
    energy_emissions float not null default 0,
    diet_emissions float not null default 0,
    waste_emissions float not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create emissions tracking table
create table emissions_tracking (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    transportation_emissions float not null default 0,
    energy_emissions float not null default 0,
    diet_emissions float not null default 0,
    waste_emissions float not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create improvement tips table
create table improvement_tips (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    category text not null check (category in ('transportation', 'energy', 'diet', 'waste', 'home', 'general')),
    link text,
    impact_level integer check (impact_level between 1 and 5),
    difficulty_level integer check (difficulty_level between 1 and 5),
    co2_reduction_potential float,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create user achievements table
create table user_achievements (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    achievement_type text not null,
    description text not null,
    earned_at timestamp with time zone default timezone('utc'::text, now()),
    points_awarded integer default 0
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table user_baselines enable row level security;
alter table emissions_tracking enable row level security;
alter table improvement_tips enable row level security;
alter table user_achievements enable row level security;

-- Create security policies
create policy "Public profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update using (auth.uid() = id);

create policy "Users can view their own baseline"
on user_baselines for select
using (auth.uid() = user_id);

create policy "Users can insert their own baseline"
on user_baselines for insert
with check (auth.uid() = user_id);

create policy "Users can update their own baseline"
on user_baselines for update
using (auth.uid() = user_id);

create policy "Users can view their own emissions"
on emissions_tracking for select
using (auth.uid() = user_id);

create policy "Users can insert their own emissions"
on emissions_tracking for insert
with check (auth.uid() = user_id);

create policy "Improvement tips are viewable by everyone"
on improvement_tips for select
using (true);

create policy "Users can view their own achievements"
on user_achievements for select
using (auth.uid() = user_id);

create policy "Users can insert their own achievements"
on user_achievements for insert
with check (auth.uid() = user_id);

-- Insert some initial improvement tips
insert into improvement_tips (title, description, category, link, impact_level, difficulty_level, co2_reduction_potential)
values
    ('Switch to renewable energy', 'Consider solar panels or switch to a green energy provider.', 'energy', 'https://www.energy.gov/energysaver/benefits-residential-solar-electricity', 5, 3, 4000),
    ('Reduce meat consumption', 'Try going meat-free one day a week to start.', 'diet', 'https://www.worldwildlife.org/stories/eat-less-meat-to-reduce-your-impact-on-earth', 4, 2, 350),
    ('Optimize transportation', 'Use public transport, carpool, or walk for shorter distances.', 'transportation', 'https://www.epa.gov/transportation-air-pollution-and-climate-change/what-you-can-do-reduce-pollution-vehicles', 4, 3, 2500),
    ('Improve home insulation', 'Add proper insulation to reduce heating and cooling energy usage.', 'home', 'https://www.energy.gov/energysaver/types-insulation', 4, 4, 1200),
    ('Reduce water waste', 'Fix leaks, take shorter showers, and collect rainwater for gardens.', 'home', 'https://www.epa.gov/watersense/start-saving', 3, 1, 300),
    ('Practice zero waste', 'Use reusable bags, containers, and minimize single-use plastics.', 'waste', 'https://www.epa.gov/trash-free-waters/preventing-trash-source-0', 3, 2, 400); 