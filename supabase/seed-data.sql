-- Seed data for projects and categories tables
-- Run this after creating projects-schema.sql and categories-schema.sql

-- ============================================
-- SEED CATEGORIES (68 predefined tags)
-- ============================================

-- Programming Languages (14)
INSERT INTO public.categories (name, icon, type, description) VALUES
('Python', '🐍', 'programming', 'Python programming language'),
('Java', '☕', 'programming', 'Java programming language'),
('C++', '⚙️', 'programming', 'C++ programming language'),
('JavaScript', '⚡', 'programming', 'JavaScript programming language'),
('Rust', '🦀', 'programming', 'Rust programming language'),
('Go', '🔵', 'programming', 'Go programming language'),
('Swift', '🔶', 'programming', 'Swift programming language'),
('TypeScript', '💠', 'programming', 'TypeScript programming language'),
('C#', '💚', 'programming', 'C# programming language'),
('C', '🔧', 'programming', 'C programming language'),
('Kotlin', '🟣', 'programming', 'Kotlin programming language'),
('PHP', '🐘', 'programming', 'PHP programming language'),
('Ruby', '💎', 'programming', 'Ruby programming language'),
('Flutter', '🦋', 'programming', 'Flutter framework')
ON CONFLICT (name) DO NOTHING;

-- Technology (12)
INSERT INTO public.categories (name, icon, type, description) VALUES
('AI', '🤖', 'technology', 'Artificial Intelligence'),
('Algo', '🧮', 'technology', 'Algorithms and data structures'),
('Spider', '🕷️', 'technology', 'Web scraping and crawlers'),
('Safe', '🔒', 'technology', 'Security and safety'),
('Linux', '🐧', 'technology', 'Linux operating system'),
('DB', '🗄️', 'technology', 'Databases'),
('Test', '🧪', 'technology', 'Testing and QA'),
('Embedded', '🔌', 'technology', 'Embedded systems'),
('Docker', '🐳', 'technology', 'Docker containerization'),
('Kubernetes', '☸️', 'technology', 'Kubernetes orchestration'),
('Vue', '💚', 'technology', 'Vue.js framework'),
('React', '⚛️', 'technology', 'React framework')
ON CONFLICT (name) DO NOTHING;

-- Application (9)
INSERT INTO public.categories (name, icon, type, description) VALUES
('Game', '🎮', 'application', 'Game development'),
('Desktop', '🖥️', 'application', 'Desktop applications'),
('Android', '🤖', 'application', 'Android development'),
('CLI', '⌨️', 'application', 'Command-line tools'),
('Web App', '🌐', 'application', 'Web applications'),
('Tool', '🔨', 'application', 'Developer tools'),
('macOS', '🍎', 'application', 'macOS applications'),
('Windows', '🪟', 'application', 'Windows applications'),
('Self-Hosted', '🏠', 'application', 'Self-hosted solutions')
ON CONFLICT (name) DO NOTHING;

-- Other (4)
INSERT INTO public.categories (name, icon, type, description) VALUES
('Tutorial', '📚', 'other', 'Learning resources'),
('Book', '📖', 'other', 'Books and documentation'),
('Collection', '📦', 'other', 'Curated collections'),
('Funny', '😄', 'other', 'Fun and entertainment')
ON CONFLICT (name) DO NOTHING;

-- Special category for "All"
INSERT INTO public.categories (name, icon, type, description) VALUES
('All', '🎯', 'other', 'All projects')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED PROJECTS (6 initial mock projects)
-- ============================================

-- Note: user_id is NULL for seed data (system-created projects)
-- Using REAL GitHub repositories for proper integration

INSERT INTO public.projects (
  title,
  description,
  author,
  avatar,
  language,
  views,
  stars,
  comments,
  category,
  tags,
  trending,
  github_url,
  created_at
) VALUES
(
  'React Native Apps Showcase',
  'Curated List of Open Source React Native Apps. Curation courtesy of ReactNativeNews/React-Native-Apps',
  'ReactNativeNews',
  '⚛️',
  'JavaScript',
  2100,
  450,
  23,
  'JavaScript',
  ARRAY['React', 'Android', 'CLI'],
  true,
  'https://github.com/ReactNativeNews/React-Native-Apps',
  timezone('utc'::text, now()) - interval '24 hours'
),
(
  'Awesome Python',
  'A curated list of awesome Python frameworks, libraries, software and resources',
  'vinta',
  '🐍',
  'Python',
  1850,
  380,
  19,
  'Python',
  ARRAY['Collection', 'Tutorial', 'Book'],
  true,
  'https://github.com/vinta/awesome-python',
  timezone('utc'::text, now()) - interval '3 days'
),
(
  'freeCodeCamp',
  'freeCodeCamp.org''s open-source codebase and curriculum. Learn to code for free.',
  'freeCodeCamp',
  '📚',
  'JavaScript',
  1620,
  295,
  15,
  'Tutorial',
  ARRAY['Tutorial', 'JavaScript', 'Web App'],
  false,
  'https://github.com/freeCodeCamp/freeCodeCamp',
  timezone('utc'::text, now()) - interval '5 days'
),
(
  'TensorFlow',
  'An Open Source Machine Learning Framework for Everyone. Computation using data flow graphs for scalable machine learning.',
  'tensorflow',
  '🤖',
  'C++',
  3200,
  620,
  31,
  'AI',
  ARRAY['AI', 'Python', 'C++'],
  true,
  'https://github.com/tensorflow/tensorflow',
  timezone('utc'::text, now()) - interval '1 day'
),
(
  'Kubernetes',
  'Production-Grade Container Orchestration. Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.',
  'kubernetes',
  '☸️',
  'Go',
  2890,
  510,
  27,
  'Technology',
  ARRAY['Kubernetes', 'Docker', 'Tool'],
  true,
  'https://github.com/kubernetes/kubernetes',
  timezone('utc'::text, now()) - interval '2 days'
),
(
  'Rust Programming Language',
  'Empowering everyone to build reliable and efficient software. A language empowering everyone to build reliable and efficient software.',
  'rust-lang',
  '🦀',
  'Rust',
  4100,
  780,
  42,
  'Rust',
  ARRAY['Rust', 'Safe', 'CLI'],
  true,
  'https://github.com/rust-lang/rust',
  timezone('utc'::text, now()) - interval '6 hours'
)
ON CONFLICT DO NOTHING;

-- Update category usage counts based on seeded projects
UPDATE public.categories SET usage_count = 2 WHERE name = 'AI';
UPDATE public.categories SET usage_count = 2 WHERE name = 'Rust';
UPDATE public.categories SET usage_count = 1 WHERE name = 'JavaScript';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Python';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Game';
UPDATE public.categories SET usage_count = 1 WHERE name = 'C++';
UPDATE public.categories SET usage_count = 2 WHERE name = 'Docker';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Kubernetes';
UPDATE public.categories SET usage_count = 1 WHERE name = 'React';
UPDATE public.categories SET usage_count = 1 WHERE name = 'TypeScript';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Test';
UPDATE public.categories SET usage_count = 2 WHERE name = 'Safe';
UPDATE public.categories SET usage_count = 1 WHERE name = 'CLI';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Algo';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Tutorial';
UPDATE public.categories SET usage_count = 1 WHERE name = 'DB';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Tool';
UPDATE public.categories SET usage_count = 2 WHERE name = 'Desktop';
UPDATE public.categories SET usage_count = 1 WHERE name = 'Web App';
