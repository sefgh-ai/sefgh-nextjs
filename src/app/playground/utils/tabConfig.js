import { Activity, Key, Settings, LineChart, TestTube } from 'lucide-react'

export const playgroundTabs = [
  {
    value: 'keys',
    label: 'API Keys',
    icon: Key,
  },
  {
    value: 'usage',
    label: 'Usage',
    icon: LineChart,
  },
  {
    value: 'limits',
    label: 'Limits',
    icon: Settings,
  },
  {
    value: 'monitoring',
    label: 'Monitor',
    icon: Activity,
  },
  {
    value: 'testing',
    label: 'Testing',
    icon: TestTube,
  },
]
