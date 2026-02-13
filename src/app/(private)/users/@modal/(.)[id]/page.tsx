//app/(private)/users/@modal/(.id)/page.tsx
'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/services/users.service';
import { UserDetail } from '@/lib/types/user';
import Modal from '@/components/ui/Modal';
import UserDetailView from '@/components/private/users/UserDetailView';
import { globalToast } from '@/lib/toast';
import { ApiError } from 'next/dist/server/api-utils';
import { formatError } from '@/lib/config/axios.config';

export default function UserDetailModal({
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

        //const data = await getUser(parseInt(resolvedParams.id));
        const userId = parseInt(resolvedParams.id);
        if (isNaN(userId) ||  resolvedParams.id === 'create') {
          router.back();
          return;
        }

        const data = await getUser(userId);

        setUser(data);
        console.log(data);
      } catch (error) {
        const apiError = error as ApiError;
        const message = formatError(apiError);
        globalToast.error(message);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router]);

  const handleClose = () => {
    router.back();
  };

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

  const handleDelete = () => {
    router.push('/users');
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Detalles del Usuario"
      maxWidth="2xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : user ? (
        <UserDetailView user={user} onUpdate={handleUpdate} onDelete={handleDelete} />
      ) : (
        <div className="text-center py-12 text-slate-500">
          Usuario no encontrado
        </div>
      )}
    </Modal>
  );
}

