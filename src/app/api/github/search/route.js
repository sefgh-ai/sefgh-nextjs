import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const sort = searchParams.get('sort') || 'best-match'
    const language = searchParams.get('language')
    const stars = searchParams.get('stars')
    const page = searchParams.get('page') || '1'
    const per_page = searchParams.get('per_page') || '30'

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Build GitHub search query
    let githubQuery = query
    if (language) {
      githubQuery += ` language:${language}`
    }
    if (stars) {
      githubQuery += ` stars:${stars}`
    }

    // Map our sort to GitHub's sort parameter
    const sortMap = {
      'best-match': '',
      'stars': 'stars',
      'forks': 'forks',
      'updated': 'updated'
    }

    const githubSort = sortMap[sort] || ''

    // GitHub API request
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(githubQuery)}&sort=${githubSort}&order=desc&page=${page}&per_page=${per_page}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SEFGH-NextJS-App',
        // Add GitHub token if you have one (recommended for higher rate limits)
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      total_count: data.total_count,
      items: data.items,
      rate_limit: {
        remaining: response.headers.get('x-ratelimit-remaining'),
        reset: response.headers.get('x-ratelimit-reset')
      }
    })

  } catch (error) {
    console.error('GitHub search error:', error)
    return NextResponse.json(
      { error: 'Failed to search repositories' },
      { status: 500 }
    )
  }
}
