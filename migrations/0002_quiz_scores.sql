create table if not exists quiz_scores (
  id         bigserial primary key,
  name       text not null check (char_length(name) between 1 and 10),
  score      integer not null check (score between 0 and 2800),
  course     text not null check (course in ('intro', 'hashira', 'infinity')),
  created_at timestamptz not null default now()
);

create index if not exists quiz_scores_rank_idx on quiz_scores (score desc, created_at asc);
