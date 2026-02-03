export interface VotingOption {
  id: number
  text: string
}

export interface VotingSession {
  id: number
  title: string
  status?: 'ACTIVE' | 'CLOSED'
  options: VotingOption[]
}

export interface VoteResult {
  optionId: number
  label: string
  votes: number
  percentage: number
}
