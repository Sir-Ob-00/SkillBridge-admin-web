import type { Category } from '@/types/category.types'

export interface Skill {
  id: string
  name: string
  active: boolean
  categoryId: string
  createdAt: string
  category: Category | null
}

export interface SkillFilters {
  categoryId?: string
  activeOnly?: boolean
}

export interface SkillForm {
  name: string
  categoryId: string
  active?: boolean
}

export type SkillList = Skill[]
