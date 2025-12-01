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
