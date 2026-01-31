
/**
 * Icons for the admissions
 * 
 * 
 */

import { ReactNode } from 'react';

interface IconProps {
  className?: string;
}

export const AdmissionsIcons = {

  email: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  check: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),

  contact: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2v2" /><path d="M17.915 22a6 6 0 0 0-12 0" /><path d="M8 2v2" /><circle cx="12" cy="12" r="4" /><rect x="3" y="4" width="18" height="18" rx="2" />
    </svg>
  ),

  nationalId: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 10h2" /><path d="M16 14h2" /><path d="M6.17 15a3 3 0 0 1 5.66 0" /><circle cx="9" cy="11" r="2" /><rect x="2" y="5" width="20" height="14" rx="2" />
    </svg>
  ),

  phone: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  ),

  calendar: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M17 14h-6" /><path d="M13 18H7" /><path d="M7 14h.01" /><path d="M17 18h.01" />
    </svg>
  ),

  location: ({ className = "w-5 h-5" }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),




} as const;

export type AdmissionsIconName = keyof typeof AdmissionsIcons;

export function getIcon(
  iconName: AdmissionsIconName,
  className?: string
): ReactNode {
  const Icon = AdmissionsIcons[iconName];
  return Icon ? <Icon className={className} /> : null;
}