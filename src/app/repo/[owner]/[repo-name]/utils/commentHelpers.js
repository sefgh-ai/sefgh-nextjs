/**
 * Fetch replies recursively for a comment
 * @param {Object} supabase - Supabase client
 * @param {string} commentId - Parent comment ID
 * @returns {Promise<Array>} Array of nested replies
 */
export async function fetchRepliesRecursively(supabase, commentId) {
  const { data: replies } = await supabase
    .from('repo_comments')
    .select('*')
    .eq('parent_id', commentId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (!replies || replies.length === 0) return []

  return await Promise.all(
    replies.map(async (reply) => {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', reply.user_id)
        .single()

      // Fallback to email if no username
      let userEmail = null
      if (!profile?.username) {
        const { data: { user: replyUser } } = await supabase.auth.admin.getUserById(reply.user_id)
        userEmail = replyUser?.email
      }

      // Fetch nested replies
      const nestedReplies = await fetchRepliesRecursively(supabase, reply.id)

      return {
        ...reply,
        user_name: profile?.username || null,
        user_email: userEmail,
        user_avatar: profile?.avatar_url || null,
        replies: nestedReplies
      }
    })
  )
}

/**
 * Enrich comments with user info and nested replies
 * @param {Object} supabase - Supabase client
 * @param {Array} rawComments - Raw comment data
 * @returns {Promise<Array>} Enriched comments with user data and replies
 */
export async function enrichCommentsWithUserData(supabase, rawComments) {
  return await Promise.all(
    (rawComments || []).map(async (comment) => {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', comment.user_id)
        .single()

      // Fallback to email if no username
      let userEmail = null
      if (!profile?.username) {
        const { data: { user: commentUser } } = await supabase.auth.admin.getUserById(comment.user_id)
        userEmail = commentUser?.email
      }

      // Fetch nested replies
      const replies = await fetchRepliesRecursively(supabase, comment.id)

      return {
        ...comment,
        user_name: profile?.username || null,
        user_email: userEmail,
        user_avatar: profile?.avatar_url || null,
        replies: replies
      }
    })
  )
}
