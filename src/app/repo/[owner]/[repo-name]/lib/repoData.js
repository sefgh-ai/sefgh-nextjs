import { logError } from '@/lib/error-tracking'

/**
 * Fetch repository data from GitHub API
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object|null>} Repository data or null if not found
 */
export async function fetchRepoFromGitHub(owner, repo) {
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
        console.log(`Repository not found: ${owner}/${repo}`)
        return null
      }
      
      if (response.status === 403) {
        // Rate limit exceeded
        console.error('GitHub API rate limit exceeded')
        logError('github_rate_limit', new Error('Rate limit exceeded'), { owner, repo })
        return null
      }

      // Log other errors but don't throw
      const errorMessage = `GitHub API error: ${response.status} ${response.statusText}`
      console.error(errorMessage, { owner, repo })
      logError('github_api_error', new Error(errorMessage), { 
        owner, 
        repo, 
        status: response.status 
      })
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching repo data:', error)
    logError('repo_fetch_failed', error, { owner, repo })
    return null
  }
}
