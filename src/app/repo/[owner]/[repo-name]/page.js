import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RepoDetailsLayout from '@/components/repo-details/RepoDetailsLayout'

// Fetch repository data from GitHub API
async function getRepoData(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        })
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch repository data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching repo data:', error)
    return null
  }
}

// Fetch SEFGH-specific data from Supabase
async function getSefghData(repoFullName) {
  const supabase = await createClient()
  
  // Get user if authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch votes
  const { data: allVotes } = await supabase
    .from('repo_votes')
    .select('vote_type')
    .eq('repo_full_name', repoFullName)

  const upvotes = allVotes?.filter(v => v.vote_type === 'upvote').length || 0
  const downvotes = allVotes?.filter(v => v.vote_type === 'downvote').length || 0

  // Get user's vote if logged in
  let userVote = null
  if (user) {
    const { data: userVoteData } = await supabase
      .from('repo_votes')
      .select('vote_type')
      .eq('user_id', user.id)
      .eq('repo_full_name', repoFullName)
      .single()

    userVote = userVoteData?.vote_type || null
  }

  // Fetch ratings
  const { data: ratings } = await supabase
    .from('repo_ratings')
    .select('*')
    .eq('repo_full_name', repoFullName)

  const totalRatings = ratings?.length || 0
  const averageRating = totalRatings > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
    : 0

  // Get user's rating if logged in
  let userRating = null
  if (user) {
    const { data: userRatingData } = await supabase
      .from('repo_ratings')
      .select('*')
      .eq('user_id', user.id)
      .eq('repo_full_name', repoFullName)
      .single()

    userRating = userRatingData || null
  }

  // Fetch top-level comments (not nested yet - will implement in comments component)
  const { data: comments } = await supabase
    .from('repo_comments')
    .select('*')
    .eq('repo_full_name', repoFullName)
    .is('parent_id', null)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    votes: {
      upvotes,
      downvotes,
      net_votes: upvotes - downvotes
    },
    userVote,
    ratings: {
      total: totalRatings,
      average: averageRating
    },
    userRating,
    comments: comments || []
  }
}

export default async function RepoDetailsPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params
  const { owner } = resolvedParams
  const repoName = resolvedParams['repo-name']

  console.log('Loading repo page:', { owner, repoName })

  // Fetch data
  const repoData = await getRepoData(owner, repoName)

  if (!repoData) {
    console.log('Repository not found:', `${owner}/${repoName}`)
    notFound()
  }

  const sefghData = await getSefghData(`${owner}/${repoName}`)

  return (
    <RepoDetailsLayout
      repoData={repoData}
      sefghData={sefghData}
      owner={owner}
      repoName={repoName}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { owner } = resolvedParams
  const repoName = resolvedParams['repo-name']
  const repoData = await getRepoData(owner, repoName)

  if (!repoData) {
    return {
      title: 'Repository Not Found'
    }
  }

  return {
    title: `${owner}/${repoName} - SEFGH`,
    description: repoData.description || `Explore ${owner}/${repoName} on SEFGH`,
    openGraph: {
      title: `${owner}/${repoName}`,
      description: repoData.description,
      images: [repoData.owner.avatar_url]
    }
  }
}
