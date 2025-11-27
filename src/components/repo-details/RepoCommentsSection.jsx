'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, ArrowBigUp, ArrowBigDown, Reply, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Single comment component (Reddit-style)
function Comment({ comment, onReply, onVote, onDelete, depth = 0 }) {
  const { user } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    setIsSubmitting(true)
    try {
      await onReply(comment.id, replyText)
      setReplyText('')
      setShowReplyForm(false)
      toast.success('Reply posted!')
    } catch (error) {
      toast.error('Failed to post reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const netVotes = comment.upvotes - comment.downvotes

  return (
    <div className={cn("space-y-2", depth > 0 && "ml-8 pl-4 border-l-2 border-white/10")}>
      <Card className="p-4 bg-card/30">
        {/* Comment Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">Anonymous User</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
              {comment.is_edited && (
                <span className="text-xs text-muted-foreground italic">(edited)</span>
              )}
            </div>
            
            {/* Comment Text */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {comment.comment_text}
            </p>
          </div>

          {/* Options Menu */}
          {user && user.id === comment.user_id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDelete(comment.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-4 text-sm">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onVote(comment.id, 'upvote')}
            >
              <ArrowBigUp className="h-4 w-4" />
            </Button>
            <span className={cn(
              "font-medium min-w-[30px] text-center",
              netVotes > 0 && "text-orange-500",
              netVotes < 0 && "text-blue-500"
            )}>
              {netVotes}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onVote(comment.id, 'downvote')}
            >
              <ArrowBigDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Reply Button */}
          {user && depth < 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-6 px-2"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Reply'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Nested Replies - Will implement recursive loading later */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function RepoCommentsSection({ repoFullName, initialComments }) {
  const { user } = useAuth()
  const [comments, setComments] = useState(initialComments || [])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'popular', 'controversial'

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error('Please login to comment')
      return
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/repo/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoFullName,
          commentText: newComment,
          parentId: null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment')
      }

      setComments([data.comment, ...comments])
      setNewComment('')
      toast.success('Comment posted!')
    } catch (error) {
      console.error('Comment error:', error)
      toast.error(error.message || 'Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId, replyText) => {
    // TODO: Implement nested reply posting
    console.log('Reply to:', parentId, replyText)
  }

  const handleVote = async (commentId, voteType) => {
    // TODO: Implement comment voting
    console.log('Vote on comment:', commentId, voteType)
  }

  const handleDelete = async (commentId) => {
    // TODO: Implement comment deletion
    console.log('Delete comment:', commentId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments ({comments.length})
        </h2>
        
        {/* Sort Options */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('popular')}
          >
            Popular
          </Button>
        </div>
      </div>

      {/* New Comment Form */}
      {user ? (
        <Card className="p-4 bg-card/50">
          <Textarea
            placeholder="Share your thoughts about this repository..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3 min-h-[100px]"
          />
          <Button
            onClick={handleCommentSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </Card>
      ) : (
        <Card className="p-4 bg-card/50 text-center">
          <p className="text-muted-foreground">
            Please login to post a comment
          </p>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-8 bg-card/50 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onVote={handleVote}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
