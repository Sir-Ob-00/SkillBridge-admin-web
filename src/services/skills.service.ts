import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { Skill, SkillFilters, SkillForm, SkillList } from '@/types/skill.types'
import apiClient from '@/api/axios'

export async function getSkills(
  params?: SkillFilters,
): Promise<SkillList> {
  const cleanParams: Record<string, string> = {}

  if (params?.categoryId && params.categoryId.trim()) {
    cleanParams.categoryId = params.categoryId.trim()
  }

  if (typeof params?.activeOnly === 'boolean') {
    cleanParams.activeOnly = params.activeOnly ? 'true' : 'false'
  }

  const { data } = await apiClient.get<SkillList | { success: true; data: SkillList }>(
    API_ENDPOINTS.SKILLS.LIST,
    Object.keys(cleanParams).length > 0 ? { params: cleanParams } : undefined,
  )

  if (Array.isArray(data)) {
    return data
  }

  return (data as { success: true; data: SkillList } | undefined)?.data ?? []
}

export async function getSkillById(id: string): Promise<Skill> {
  const { data } = await apiClient.get<Skill | { success: true; data: Skill }>(
    API_ENDPOINTS.SKILLS.DETAILS(id),
  )

  if (typeof data === 'object' && data !== null && 'success' in data) {
    return (data as { success: true; data: Skill }).data
  }

  return data as Skill
}

export async function createSkill(
  payload: SkillForm,
): Promise<Skill> {
  const { data } = await apiClient.post<Skill | { success: true; data: Skill }>(
    API_ENDPOINTS.SKILLS.CREATE,
    payload,
  )

  if (typeof data === 'object' && data !== null && 'success' in data) {
    return (data as { success: true; data: Skill }).data
  }

  return data as Skill
}

export async function updateSkill(
  id: string,
  payload: Partial<SkillForm>,
): Promise<Skill> {
  const { data } = await apiClient.patch<Skill | { success: true; data: Skill }>(
    API_ENDPOINTS.SKILLS.UPDATE(id),
    payload,
  )

  if (typeof data === 'object' && data !== null && 'success' in data) {
    return (data as { success: true; data: Skill }).data
  }

  return data as Skill
}

export async function deleteSkill(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.SKILLS.DELETE(id))
}
