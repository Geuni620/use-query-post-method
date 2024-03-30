import { useMutation, useQueryClient } from '@tanstack/react-query';

const getTableDataViaPOST = async ({
  searchCondition,
}: {
  searchCondition: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchCondition }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();

  return data;
};

export const useTableDataGetMutation = () => {
  const queryClient = useQueryClient();

  const tableList = useMutation({
    mutationFn: getTableDataViaPOST,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table'],
      });
    },
  });

  return tableList;
};