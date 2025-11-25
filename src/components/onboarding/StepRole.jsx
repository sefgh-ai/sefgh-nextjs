'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { saveStepRole } from '@/lib/supabase/onboarding'
import { toast } from 'sonner'
import { GraduationCap, Briefcase, FlaskConical, Sparkles } from 'lucide-react'

const roles = [
  {
    value: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'Learning to code and exploring new technologies'
  },
  {
    value: 'professional',
    label: 'Professional',
    icon: Briefcase,
    description: 'Working as a developer or engineer'
  },
  {
    value: 'researcher',
    label: 'Researcher',
    icon: FlaskConical,
    description: 'Academic research or studying technologies'
  },
  {
    value: 'hobbyist',
    label: 'Hobbyist',
    icon: Sparkles,
    description: 'Coding for fun and personal projects'
  }
]

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', description: '< 1 year' },
  { value: 'intermediate', label: 'Intermediate', description: '1-3 years' },
  { value: 'expert', label: 'Expert', description: '3+ years' }
]

export function StepRole({ userId, onNext }) {
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selectedRole || !selectedExperience) {
      toast.error('Please select both role and experience level')
      return
    }

    setLoading(true)
    try {
      await saveStepRole(userId, selectedRole, selectedExperience)
      onNext()
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error('Failed to save your selection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Bot message */}
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-[#238636] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <p className="text-white text-sm mb-2">
              Hey there! 👋 I'm <span className="font-semibold text-[#238636]">SEFGH AI Assistant</span>
            </p>
            <p className="text-[#8b949e] text-sm">
              Let's personalize your experience! First, tell me about yourself...
            </p>
          </div>
        </div>
      </div>

      {/* Role selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">
          What best describes you?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedRole === role.value
                    ? 'border-[#238636] bg-[#238636]/10'
                    : 'border-[#30363d] bg-[#161b22] hover:border-[#8b949e]'
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${
                  selectedRole === role.value ? 'text-[#238636]' : 'text-[#8b949e]'
                }`} />
                <div className="font-medium text-white text-sm mb-1">
                  {role.label}
                </div>
                <div className="text-xs text-[#8b949e]">
                  {role.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Experience level */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">
          Experience level?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {experienceLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSelectedExperience(level.value)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedExperience === level.value
                  ? 'border-[#238636] bg-[#238636]/10'
                  : 'border-[#30363d] bg-[#161b22] hover:border-[#8b949e]'
              }`}
            >
              <div className={`font-medium text-sm mb-1 ${
                selectedExperience === level.value ? 'text-[#238636]' : 'text-white'
              }`}>
                {level.label}
              </div>
              <div className="text-xs text-[#8b949e]">
                {level.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedRole || !selectedExperience || loading}
          className="bg-[#238636] hover:bg-[#2ea043] text-white"
        >
          {loading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
