import { useQuery } from '@tanstack/react-query';
import camelcaseKeys from 'camelcase-keys';

const getTableDataViaPOST = async ({
  searchCondition,
}: {
  searchCondition: string;
}) => {
  console.log('searchCondition', searchCondition);
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
  const camelcaseData = camelcaseKeys(data, { deep: true });

  return camelcaseData;
};

type TableDataProps = {
  searchCondition: string;
};

export const useTableDataGetQuery = ({ searchCondition }: TableDataProps) => {
  console.log('userTableDataGetQuery', searchCondition);
  return useQuery({
    queryFn: () => getTableDataViaPOST({ searchCondition }),
    queryKey: ['table', searchCondition],
  });
};
