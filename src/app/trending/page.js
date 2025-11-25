'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SearchNavbar } from '@/components/search/SearchNavbar';
import { SearchSidebar } from '@/components/search/SearchSidebar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  GitFork,
  TrendingUp,
  Eye,
  MessageSquare,
  Flame,
  Code,
  Users as UsersIcon,
  ChevronDown,
  Search,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllTrendingRepos, isTrendingDataStale, getLastRefreshTime, TRENDING_TOPICS } from '@/lib/trending';

export default function TrendingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('repositories'); // 'repositories' or 'developers'
  const [spokenLanguage, setSpokenLanguage] = useState('english');
  const [programmingLanguage, setProgrammingLanguage] = useState('any');
  const [dateRange, setDateRange] = useState('daily');
  const [sortBy, setSortBy] = useState('stars');
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [languageSearch, setLanguageSearch] = useState('');
  const [spokenLanguageSearch, setSpokenLanguageSearch] = useState('');
  const [customTrendingData, setCustomTrendingData] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isDataStale, setIsDataStale] = useState(false);

  // Comprehensive list of spoken languages
  const spokenLanguages = [
    'any',
    'abkhazian',
    'afar',
    'afrikaans',
    'akan',
    'albanian',
    'amharic',
    'arabic',
    'aragonese',
    'armenian',
    'assamese',
    'avaric',
    'avestan',
    'aymara',
    'azerbaijani',
    'bambara',
    'bashkir',
    'basque',
    'belarusian',
    'bengali',
    'bihari',
    'bislama',
    'bosnian',
    'breton',
    'bulgarian',
    'burmese',
    'catalan',
    'chamorro',
    'chechen',
    'chichewa',
    'chinese',
    'chuvash',
    'cornish',
    'corsican',
    'cree',
    'croatian',
    'czech',
    'danish',
    'divehi',
    'dutch',
    'dzongkha',
    'english',
    'esperanto',
    'estonian',
    'ewe',
    'faroese',
    'fijian',
    'finnish',
    'french',
    'fula',
    'galician',
    'georgian',
    'german',
    'greek',
    'guaraní',
    'gujarati',
    'haitian',
    'hausa',
    'hebrew',
    'herero',
    'hindi',
    'hiri motu',
    'hungarian',
    'interlingua',
    'indonesian',
    'interlingue',
    'irish',
    'igbo',
    'inupiaq',
    'ido',
    'icelandic',
    'italian',
    'inuktitut',
    'japanese',
    'javanese',
    'kalaallisut',
    'kannada',
    'kanuri',
    'kashmiri',
    'kazakh',
    'khmer',
    'kikuyu',
    'kinyarwanda',
    'kyrgyz',
    'komi',
    'kongo',
    'korean',
    'kurdish',
    'kwanyama',
    'latin',
    'luxembourgish',
    'ganda',
    'limburgish',
    'lingala',
    'lao',
    'lithuanian',
    'luba-katanga',
    'latvian',
    'manx',
    'macedonian',
    'malagasy',
    'malay',
    'malayalam',
    'maltese',
    'māori',
    'marathi',
    'marshallese',
    'mongolian',
    'nauru',
    'navajo',
    'northern ndebele',
    'nepali',
    'ndonga',
    'norwegian bokmål',
    'norwegian nynorsk',
    'norwegian',
    'nuosu',
    'southern ndebele',
    'occitan',
    'ojibwe',
    'old church slavonic',
    'oromo',
    'oriya',
    'ossetian',
    'panjabi',
    'pāli',
    'persian',
    'polish',
    'pashto',
    'portuguese',
    'quechua',
    'romansh',
    'kirundi',
    'romanian',
    'russian',
    'sanskrit',
    'sardinian',
    'sindhi',
    'northern sami',
    'samoan',
    'sango',
    'serbian',
    'scottish gaelic',
    'shona',
    'sinhala',
    'slovak',
    'slovene',
    'somali',
    'southern sotho',
    'spanish',
    'sundanese',
    'swahili',
    'swati',
    'swedish',
    'tamil',
    'telugu',
    'tajik',
    'thai',
    'tigrinya',
    'tibetan',
    'turkmen',
    'tagalog',
    'tswana',
    'tonga',
    'turkish',
    'tsonga',
    'tatar',
    'twi',
    'tahitian',
    'uyghur',
    'ukrainian',
    'urdu',
    'uzbek',
    'venda',
    'vietnamese',
    'volapük',
    'walloon',
    'welsh',
    'wolof',
    'western frisian',
    'xhosa',
    'yiddish',
    'yoruba',
    'zhuang',
    'zulu',
  ];

  const sortOptions = [
    { value: 'stars', label: 'Most Starred' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'growth', label: 'Fastest Growing' },
    { value: 'discussed', label: 'Most Discussed' },
  ];

  useEffect(() => {
    fetchProgrammingLanguages();
    fetchCustomTrendingData();
    checkDataFreshness();
  }, []);

  useEffect(() => {
    fetchTrendingData();
  }, [activeTab, programmingLanguage, spokenLanguage, dateRange]);

  const fetchProgrammingLanguages = async () => {
    try {
      const response = await fetch('/api/github/languages');
      if (response.ok) {
        const data = await response.json();
        setProgrammingLanguages(['any', ...data]);
      } else {
        // Fallback to common languages
        setProgrammingLanguages([
          'any',
          'javascript',
          'python',
          'java',
          'typescript',
          'go',
          'rust',
          'c++',
          'c#',
          'php',
          'ruby',
          'swift',
          'kotlin',
          'c',
          'scala',
          'shell',
          'dart',
          'r',
          'objective-c',
          'perl',
          'haskell',
          'lua',
          'groovy',
          'elixir',
          'clojure',
        ]);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      setProgrammingLanguages(['any', 'javascript', 'python', 'java', 'typescript']);
    }
  };

  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'repositories') {
        await fetchTrendingRepos();
      } else {
        await fetchTrendingDevelopers();
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
      toast.error('Failed to load trending data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingRepos = async () => {
    try {
      // Use GitHub trending scraper or API
      const langParam = programmingLanguage !== 'any' ? `?language=${programmingLanguage}` : '';
      const spokenLangParam = spokenLanguage !== 'any' ? `&spokenLanguage=${spokenLanguage}` : '';
      const response = await fetch(`/api/github/trending${langParam}${spokenLangParam}&since=${dateRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setRepositories(data);
      } else {
        // Fallback to mock data
        setRepositories(getMockRepos());
      }
    } catch (error) {
      setRepositories(getMockRepos());
    }
  };

  const fetchTrendingDevelopers = async () => {
    try {
      const response = await fetch(`/api/github/trending-developers?since=${dateRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setDevelopers(data);
      } else {
        setDevelopers(getMockDevelopers());
      }
    } catch (error) {
      setDevelopers(getMockDevelopers());
    }
  };

  // Fetch custom curated trending data
  const fetchCustomTrendingData = async () => {
    try {
      const data = await getAllTrendingRepos();
      setCustomTrendingData(data);
    } catch (error) {
      console.error('Error fetching custom trending:', error);
    }
  };

  // Check if data needs refresh
  const checkDataFreshness = async () => {
    try {
      const stale = await isTrendingDataStale();
      setIsDataStale(stale);
      
      const lastTime = await getLastRefreshTime();
      setLastRefresh(lastTime);
    } catch (error) {
      console.error('Error checking data freshness:', error);
    }
  };

  // Manual refresh trending data
  const handleRefreshTrending = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing trending repos...', {
      description: 'This may take a minute'
    });

    try {
      const response = await fetch('/api/trending/refresh', {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Trending repos updated!', {
          description: `Fetched ${result.totalRepos} repositories`
        });
        
        // Refresh the data
        await fetchCustomTrendingData();
        await checkDataFreshness();
      } else {
        toast.error('Failed to refresh', {
          description: result.error
        });
      }
    } catch (error) {
      console.error('Error refreshing trending:', error);
      toast.error('Refresh failed', {
        description: error.message
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMockRepos = () => [
    {
      id: 1,
      author: '666ghi',
      name: 'BettaFish',
      description: '微模！人人可用的多Agent模拟分析助手，打破信息茧房，还原真相框架，预测未来走向，辅助决策！从0实现，不依赖任何框架。',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 17779,
      forks: 3465,
      starsToday: 3224,
      contributors: [
        { avatar: '👨‍💻', name: 'user1' },
        { avatar: '👩‍💻', name: 'user2' },
        { avatar: '🧑‍💻', name: 'user3' },
      ],
      heatLevel: 3,
      trending: true,
    },
    {
      id: 2,
      author: 'Skyvern-AI',
      name: 'skyvern',
      description: 'Automate browser based workflows with AI',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 16673,
      forks: 1414,
      starsToday: 878,
      contributors: [
        { avatar: '👨‍💻', name: 'user1' },
        { avatar: '👩‍💻', name: 'user2' },
      ],
      heatLevel: 3,
      trending: true,
    },
    {
      id: 3,
      author: 'nocobase',
      name: 'nocobase',
      description: 'NocoBase is the most extensible AI-powered no-code/low-code platform for building business applications and enterprise solutions.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 18132,
      forks: 2056,
      starsToday: 379,
      contributors: [
        { avatar: '👨‍💻', name: 'user1' },
        { avatar: '👩‍💻', name: 'user2' },
        { avatar: '🧑‍💻', name: 'user3' },
        { avatar: '👨‍💻', name: 'user4' },
      ],
      heatLevel: 2,
      trending: true,
    },
    {
      id: 4,
      author: 'mudler',
      name: 'LocalAI',
      description: 'The free, Open Source alternative to OpenAI, Claude and others. Self-hosted and local-first.',
      language: 'Go',
      languageColor: '#00ADD8',
      stars: 37512,
      forks: 2956,
      starsToday: 351,
      contributors: [
        { avatar: '👨‍💻', name: 'user1' },
        { avatar: '👩‍💻', name: 'user2' },
        { avatar: '🧑‍💻', name: 'user3' },
      ],
      heatLevel: 2,
      trending: true,
    },
    {
      id: 5,
      author: 'facebook',
      name: 'react',
      description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
      language: 'JavaScript',
      languageColor: '#f1e05a',
      stars: 228000,
      forks: 46700,
      starsToday: 245,
      contributors: [
        { avatar: '👨‍💻', name: 'user1' },
        { avatar: '👩‍💻', name: 'user2' },
        { avatar: '🧑‍💻', name: 'user3' },
        { avatar: '👨‍💻', name: 'user4' },
        { avatar: '👩‍💻', name: 'user5' },
      ],
      heatLevel: 2,
      trending: false,
    },
  ];

  const getMockDevelopers = () => [
    {
      id: 1,
      rank: 1,
      name: 'Shaun Smith',
      username: 'evalstate',
      avatar: '👨‍💻',
      popularRepo: {
        name: 'fast-agent',
        description: 'Define, Prompt and Test MCP enabled Agents and Workflows',
      },
      following: false,
    },
    {
      id: 2,
      rank: 2,
      name: 'Pekka Enberg',
      username: 'penberg',
      avatar: '👩‍💻',
      popularRepo: {
        name: 'agentfs',
        description: 'The filesystem for agents',
      },
      following: false,
    },
    {
      id: 3,
      rank: 3,
      name: 'Eric Buehler',
      username: 'EricLBuehler',
      avatar: '🧑‍💻',
      popularRepo: {
        name: 'mistral.rs',
        description: 'Blazingly fast LLM inference.',
      },
      following: false,
    },
    {
      id: 4,
      rank: 4,
      name: 'Elie Steinbock',
      username: 'elie222',
      avatar: '👨‍🔬',
      popularRepo: {
        name: 'inbox-zero',
        description: "The world's best AI personal assistant for email. Open source app to help you reach inbox zero fast.",
      },
      following: false,
    },
    {
      id: 5,
      rank: 5,
      name: 'Marc Seitz',
      username: 'mfts',
      avatar: '👨‍💼',
      popularRepo: {
        name: 'papermark',
        description: 'Papermark is the open-source DocSend alternative with built-in analytics and custom domains.',
      },
      following: false,
    },
  ];

  const getHeatIndicator = (level) => {
    const flames = Array(level).fill('🔥').join('');
    return flames;
  };

  const sortRepositories = (repos) => {
    const sorted = [...repos];
    switch (sortBy) {
      case 'stars':
        return sorted.sort((a, b) => b.stars - a.stars);
      case 'views':
        return sorted.sort((a, b) => (b.starsToday || 0) - (a.starsToday || 0));
      case 'growth':
        return sorted.sort((a, b) => (b.starsToday / b.stars) - (a.starsToday / a.stars));
      case 'discussed':
        return sorted.sort((a, b) => (b.forks || 0) - (a.forks || 0));
      default:
        return sorted;
    }
  };

  // Convert custom trending data to display format
  const getCustomTrendingRepos = () => {
    const allRepos = [];
    
    Object.keys(customTrendingData).forEach(topicId => {
      const topic = TRENDING_TOPICS.find(t => t.id === topicId);
      const topicRepos = customTrendingData[topicId] || [];
      
      topicRepos.forEach((item, index) => {
        const repo = item.repo_data;
        allRepos.push({
          id: item.id,
          author: repo.owner?.login || 'unknown',
          name: repo.name,
          description: repo.description || 'No description available',
          language: repo.language || 'Unknown',
          languageColor: getLanguageColor(repo.language),
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          starsToday: Math.floor(Math.random() * 500) + 100, // TODO: Calculate actual daily stars
          contributors: [
            { avatar: '👨‍💻', name: 'user1' },
            { avatar: '👩‍💻', name: 'user2' },
            { avatar: '🧑‍💻', name: 'user3' },
          ],
          heatLevel: 3,
          trending: true,
          topic: topic?.name || topicId,
          topicIcon: topic?.icon || '🔥'
        });
      });
    });

    return allRepos;
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572A5',
      'Java': '#b07219',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'C++': '#f34b7d',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#ffac45',
      'Kotlin': '#A97BFF',
      'Shell': '#89e051',
      'Dart': '#00B4AB',
      'R': '#198CE7'
    };
    return colors[language] || '#8b949e';
  };

  // Merge custom trending with fetched repos
  const customRepos = getCustomTrendingRepos();
  const allRepos = [...customRepos, ...repositories];
  const displayRepos = sortRepositories(allRepos);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background gradient-mesh p-4 gap-4 flex-col">
        <div className="flex gap-4 flex-1">
          <SearchSidebar user={user} />

          <SidebarInset className="flex flex-col glass-premium rounded-2xl shadow-premium border border-white/10 overflow-hidden flex-1">
          <SearchNavbar />

          <main className="flex-1 py-6 px-4 pb-4 overflow-auto">
            <div className="max-w-7xl mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Trending</h1>
                <p className="text-muted-foreground">See what the community is most excited about today.</p>
                
                {/* Refresh Info */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {lastRefresh && (
                    <span className="text-sm text-muted-foreground">
                      Last updated: {new Date(lastRefresh).toLocaleDateString()}
                    </span>
                  )}
                  {isDataStale && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Data is older than 3 days
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshTrending}
                    disabled={isRefreshing}
                    className="hover:bg-accent"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Trending'}
                  </Button>
                </div>
              </div>

              {/* Filter Bar */}
              <Card className="glass-premium border-border backdrop-blur-sm mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center flex-wrap gap-3">
                    {/* Tabs */}
                    <div className="flex gap-2 mr-auto">
                      <Button
                        variant={activeTab === 'repositories' ? 'default' : 'outline'}
                        size="sm"
                        className={
                          activeTab === 'repositories'
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            : 'hover:bg-accent'
                        }
                        onClick={() => setActiveTab('repositories')}
                      >
                        Repositories
                      </Button>
                      <Button
                        variant={activeTab === 'developers' ? 'default' : 'outline'}
                        size="sm"
                        className={
                          activeTab === 'developers'
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            : 'hover:bg-accent'
                        }
                        onClick={() => setActiveTab('developers')}
                      >
                        Developers
                      </Button>
                    </div>

                    {/* Spoken Language */}
                    <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
                      <SelectTrigger className="w-[240px] bg-card border-border">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-xs text-muted-foreground/70 shrink-0" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.15)' }}>Spoken Language:</span>
                          <SelectValue placeholder="Spoken Language" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-[300px]">
                        <div className="p-2 sticky top-0 bg-card z-10 border-b border-border">
                          <input
                            type="text"
                            placeholder="Filter spoken languages"
                            className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
                            value={spokenLanguageSearch}
                            onChange={(e) => setSpokenLanguageSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {spokenLanguages
                          .filter((lang) =>
                            lang.toLowerCase().includes(spokenLanguageSearch.toLowerCase())
                          )
                          .map((lang) => (
                            <SelectItem
                              key={lang}
                              value={lang}
                              className="focus:bg-accent"
                            >
                              {lang === 'any' ? 'Any' : lang.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {/* Programming Language */}
                    <Select value={programmingLanguage} onValueChange={setProgrammingLanguage}>
                      <SelectTrigger className="w-[200px] bg-card border-border">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-xs text-muted-foreground/70 shrink-0" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.15)' }}>Language:</span>
                          <SelectValue placeholder="Language" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-[300px]">
                        <div className="p-2 sticky top-0 bg-card z-10 border-b border-border">
                          <input
                            type="text"
                            placeholder="Filter languages"
                            className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
                            value={languageSearch}
                            onChange={(e) => setLanguageSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {programmingLanguages
                          .filter((lang) =>
                            lang.toLowerCase().includes(languageSearch.toLowerCase())
                          )
                          .map((lang) => (
                            <SelectItem
                              key={lang}
                              value={lang}
                              className="focus:bg-accent"
                            >
                              {lang === 'any' ? 'Any' : lang.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {/* Date Range */}
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-[150px] bg-card border-border">
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="daily" className="focus:bg-accent">
                          Today
                        </SelectItem>
                        <SelectItem value="weekly" className="focus:bg-accent">
                          This Week
                        </SelectItem>
                        <SelectItem value="monthly" className="focus:bg-accent">
                          This Month
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort By */}
                    {activeTab === 'repositories' && (
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] bg-card border-border">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {sortOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="focus:bg-accent"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="space-y-4 pr-4">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <Card
                        key={i}
                        className="bg-slate-900/50 border-slate-800 backdrop-blur-sm animate-pulse"
                      >
                        <CardContent className="p-6">
                          <div className="h-6 bg-slate-800 rounded w-3/4 mb-4"></div>
                          <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))
                  ) : activeTab === 'repositories' ? (
                    // Repositories List
                    displayRepos.map((repo, index) => (
                      <Card
                        key={repo.id}
                        className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50 backdrop-blur-sm group"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-8 text-center">
                              <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>
                            </div>

                            {/* Repo Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                <Code className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>

                            {/* Repo Info */}
                            <div className="flex-1 min-w-0">
                              {/* Title */}
                              <h3
                                className="text-lg font-semibold text-primary hover:text-primary/80 cursor-pointer mb-2 flex items-center gap-2"
                                onClick={() => router.push(`/repo/${repo.author}/${repo.name}`)}
                              >
                                <span className="text-muted-foreground">{repo.author}</span>
                                <span className="text-muted-foreground">/</span>
                                <span>{repo.name}</span>
                                {repo.trending && (
                                  <span className="text-base">{getHeatIndicator(repo.heatLevel)}</span>
                                )}
                                {/* Topic Badge */}
                                {repo.topic && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {repo.topicIcon} {repo.topic}
                                  </Badge>
                                )}
                              </h3>

                              {/* Description */}
                              <p className="text-sm text-muted-foreground mb-4">{repo.description}</p>

                              {/* Meta Info */}
                              <div className="flex items-center gap-6 text-sm">
                                {/* Language */}
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: repo.languageColor }}
                                  ></div>
                                  <span className="text-muted-foreground">{repo.language}</span>
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Star className="w-4 h-4" />
                                  <span>{repo.stars.toLocaleString()}</span>
                                </div>

                                {/* Forks */}
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <GitFork className="w-4 h-4" />
                                  <span>{repo.forks.toLocaleString()}</span>
                                </div>

                                {/* Built by */}
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground text-xs">Built by</span>
                                  <div className="flex -space-x-2">
                                    {repo.contributors.map((contributor, i) => (
                                      <Avatar key={i} className="w-6 h-6 border-2 border-background">
                                        <AvatarFallback className="text-xs">
                                          {contributor.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Stars Today */}
                            <div className="flex-shrink-0 flex flex-col items-end gap-3">
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Star className="w-4 h-4" />
                                    <span className="font-semibold">{repo.starsToday.toLocaleString()}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">stars today</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Star
                              </Button>
                            </div>
                          </div>

                          {/* Growth Progress Bar */}
                          {repo.starsToday > 0 && (
                            <div className="mt-4 pl-12">
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${Math.min((repo.starsToday / repo.stars) * 100 * 10, 100)}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Growth: {((repo.starsToday / repo.stars) * 100).toFixed(2)}% today
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    // Developers List
                    developers.map((dev) => (
                      <Card
                        key={dev.id}
                        className="glass-premium border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-8 text-center">
                              <span className="text-2xl font-bold text-muted-foreground">{dev.rank}</span>
                            </div>

                            {/* Developer Avatar */}
                            <Avatar className="w-16 h-16 border-2">
                              <AvatarFallback className="text-3xl">
                                {dev.avatar}
                              </AvatarFallback>
                            </Avatar>

                            {/* Developer Info */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-lg font-semibold text-primary hover:text-primary/80 cursor-pointer"
                                onClick={() => router.push(`/user/${dev.username}`)}
                              >
                                {dev.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">{dev.username}</p>

                              {/* Popular Repo */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Flame className="w-4 h-4 text-primary" />
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Popular Repo
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-muted-foreground" />
                                  <span
                                    className="text-sm text-primary hover:text-primary/80 cursor-pointer font-medium"
                                    onClick={() =>
                                      router.push(`/repo/${dev.username}/${dev.popularRepo.name}`)
                                    }
                                  >
                                    {dev.popularRepo.name}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground pl-6">
                                  {dev.popularRepo.description}
                                </p>
                              </div>
                            </div>

                            {/* Follow Button */}
                            <div className="flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                Follow
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </main>
        </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
