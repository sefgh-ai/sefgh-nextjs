import { fetchRepliesRecursively, enrichCommentsWithUserData } from '../utils/commentHelpers'

/**
 * Fetch SEFGH-specific data from Supabase
 * @param {Object} supabase - Supabase client instance
 * @param {string} repoFullName - Full repository name (owner/repo)
 * @returns {Promise<Object>} SEFGH data including votes, ratings, comments, saves
 */
export async function fetchSefghData(supabase, repoFullName) {
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch votes
  const votesData = await fetchVotesData(supabase, repoFullName, user)
  
  // Fetch ratings
  const ratingsData = await fetchRatingsData(supabase, repoFullName, user)
  
  // Fetch comments
  const commentsData = await fetchCommentsData(supabase, repoFullName)
  
  // Fetch collection/save status
  const savesData = await fetchSavesData(supabase, repoFullName, user)

  return {
    votes: votesData.votes,
    userVote: votesData.userVote,
    ratings: ratingsData.ratings,
    userRating: ratingsData.userRating,
    comments: commentsData,
    saveCount: savesData.saveCount,
    userSaved: savesData.userSaved
  }
}

/**
 * Fetch voting data for repository
 */
async function fetchVotesData(supabase, repoFullName, user) {
  const { data: allVotes } = await supabase
    .from('repo_votes')
    .select('vote_type')
    .eq('repo_full_name', repoFullName)

  const upvotes = allVotes?.filter(v => v.vote_type === 'upvote').length || 0
  const downvotes = allVotes?.filter(v => v.vote_type === 'downvote').length || 0

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

  return {
    votes: {
      upvotes,
      downvotes,
      net_votes: upvotes - downvotes
    },
    userVote
  }
}

/**
 * Fetch ratings data for repository
 */
async function fetchRatingsData(supabase, repoFullName, user) {
  const { data: ratings } = await supabase
    .from('repo_ratings')
    .select('*')
    .eq('repo_full_name', repoFullName)

  const totalRatings = ratings?.length || 0
  const averageRating = totalRatings > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
    : 0

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

  return {
    ratings: {
      total: totalRatings,
      average: averageRating
    },
    userRating
  }
}

/**
 * Fetch comments data for repository
 */
async function fetchCommentsData(supabase, repoFullName) {
  const { data: rawComments } = await supabase
    .from('repo_comments')
    .select('*')
    .eq('repo_full_name', repoFullName)
    .is('parent_id', null)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(10)

  return await enrichCommentsWithUserData(supabase, rawComments)
}

/**
 * Fetch collection/save data for repository
 */
async function fetchSavesData(supabase, repoFullName, user) {
  const { data: saves } = await supabase
    .from('repo_collections')
    .select('user_id')
    .eq('repo_full_name', repoFullName)

  const saveCount = saves?.length || 0
  let userSaved = false
  if (user) {
    userSaved = saves?.some(s => s.user_id === user.id) || false
  }

  return { saveCount, userSaved }
}
