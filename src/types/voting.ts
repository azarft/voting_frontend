export interface VotingOption {
  id: number
  name?: string
  text?: string
}

export interface VotingSession {
  id: number
  title: string
  status?: 'DRAFT' | 'ACTIVE' | 'CLOSED'
  options: VotingOption[]
}

export interface VoteResult {
  optionId: number
  label: string
  votes: number
  percentage: number
}

export const getOptionLabel = (option: VotingOption) => option.name ?? option.text ?? ''
