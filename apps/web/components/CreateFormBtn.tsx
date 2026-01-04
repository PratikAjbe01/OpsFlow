'use client';

import { useCreateFormMutation } from '@/lib/redux/api/formApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateFormBtn() {
  const router = useRouter();
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const [createForm, { isLoading }] = useCreateFormMutation();

  const handleCreate = async () => {
    if (!currentWorkspace) return;
    
    const name = prompt('Form Name:');
    if (!name) return;

    try {
      const form = await createForm({ 
        name, 
        workspaceId: currentWorkspace._id 
      }).unwrap();
      
      // Redirect to the Builder immediately
      router.push(`/builder/${form._id}`);
    } catch (error) {
      alert('Failed to create form');
    }
  };

  if (!currentWorkspace) return null;

  return (
    <button
      onClick={handleCreate}
      disabled={isLoading}
      className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-blue-500 hover:bg-blue-50 transition-all group"
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
          <Plus className="h-6 w-6 text-blue-600" />
        </div>
        <span className="mt-2 block text-sm font-semibold text-gray-900">
          {isLoading ? 'Creating...' : 'Create New Form'}
        </span>
      </div>
    </button>
  );
}