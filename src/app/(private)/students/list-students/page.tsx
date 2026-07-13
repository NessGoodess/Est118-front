import { redirect } from 'next/navigation';

export default function ListStudents() {
  redirect('/students/all-students');
}