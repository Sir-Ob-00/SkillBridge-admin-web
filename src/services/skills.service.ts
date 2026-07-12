import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { Skill, SkillFilters, SkillForm, SkillList } from '@/types/skill.types'
import apiClient from '@/api/axios'

export async function getSkills(
  params?: SkillFilters,
): Promise<SkillList> {
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== '',
        ),
      )
    : undefined

  const { data } = await apiClient.get<{ success: true; data: SkillList }>(
    API_ENDPOINTS.SKILLS.LIST,
    { params: cleanParams },
  )
  return data.data ?? []
}

export async function getSkillById(id: string): Promise<Skill> {
  const { data } = await apiClient.get<{ success: true; data: Skill }>(
    API_ENDPOINTS.SKILLS.DETAILS(id),
  )
  return data.data
}

export async function createSkill(
  payload: SkillForm,
): Promise<Skill> {
  const { data } = await apiClient.post<{ success: true; data: Skill }>(
    API_ENDPOINTS.SKILLS.CREATE,
    payload,
  )
  return data.data
}

export async function updateSkill(
  id: string,
  payload: Partial<SkillForm>,
): Promise<Skill> {
  const { data } = await apiClient.patch<{ success: true; data: Skill }>(
    API_ENDPOINTS.SKILLS.UPDATE(id),
    payload,
  )
  return data.data
}

export async function deleteSkill(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.SKILLS.DELETE(id))
}
