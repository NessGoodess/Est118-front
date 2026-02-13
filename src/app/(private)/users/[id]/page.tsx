//app/(private)/users/[id]/page.tsx
'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/services/users.service';
import { UserDetail } from '@/lib/types/user';
import UserDetailView from '@/components/private/users/UserDetailView';
import { globalToast } from '@/lib/toast';
import { withPagePermission } from '@/components/guards/withPagePermission';
import { formatError } from '@/lib/config/axios.config';
import { ApiError } from '@/lib/types/auth';

function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUser(parseInt(resolvedParams.id));
        setUser(data);
      } catch (error) {
        const apiError = error as ApiError;
        const message = formatError(apiError);
        globalToast.error(message);
        router.push('/users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router]);

  const handleUpdate = async () => {
    try {
      const data = await getUser(parseInt(resolvedParams.id));
      setUser(data);
    } catch (error) {
      const apiError = error as ApiError;
      const message = formatError(apiError);
      globalToast.error(message);
    }
  };

  const handleDelete = async () => {
    router.replace('/users');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12 text-slate-500">
          Usuario no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <UserDetailView user={user} onUpdate={handleUpdate} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default withPagePermission(UserDetailPage);
