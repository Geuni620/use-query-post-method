import { useMutation, useQueryClient } from '@tanstack/react-query';

const changeToggle = async ({
  selectedRow,
}: {
  selectedRow: Record<number, boolean>;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ selectedRow }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();

  return data;
};

export const useToggleMutation = () => {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: changeToggle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table'],
      });
    },
  });

  return toggleMutation;
};
