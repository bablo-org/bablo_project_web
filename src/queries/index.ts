import { auth } from '../services/firebase';

// Define a default query function that will pathExcludedBaseUrl and fetch request options
export const defaultQueryFn = async ({
  queryKey,
  requestOptions = {},
}: {
  queryKey: string[];
  requestOptions?: RequestInit;
}) => {
  if (!auth?.currentUser) {
    throw new Error('User is not authenticated');
  }
  const apiBase = 'https://api-5cpqvpy3cq-uc.a.run.app';
  // @ts-expect-error incorrect typing in SDK
  const token = auth.currentUser?.accessToken;

  const contentType =
    requestOptions?.method && requestOptions.method.toUpperCase() !== 'GET'
      ? { 'Content-Type': 'application/json' }
      : {};
  const updatedHeaders: Headers = {
    ...requestOptions?.headers,
    // @ts-expect-error Header type is not compatible with string
    Authorization: token,
    ...contentType,
  };
  const updatedRequestOptions: RequestInit = {
    ...requestOptions,
    headers: updatedHeaders,
  };
  const response = await fetch(
    `${apiBase}/${queryKey[0]}`,
    updatedRequestOptions,
  );
  if (!response.ok) {
    throw new Error(response.status.toString());
  }
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn('Trying to parse empty JSON response');
    return {};
  }
};

export { useGetCurrencies } from './currencies';
export {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
  useGetTransactions,
  usePostTransaction,
} from './transactions';
export {
  useGetUsers,
  useUpdateUser,
  useUpdateUserAvatar,
  useUpdateTgUserName,
  useUpdateUserSettings,
} from './users';
