import { redirect } from 'next/navigation';

export default function LegacyCloseCycleRedirect() {
  redirect('/school/re-enrollment');
}
