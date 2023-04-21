import { auth } from '../services/firebase';

// Define a default query function that will pathExcludedBaseUrl and fetch request options
export const defaultQueryFn = async ({ queryKey, requestOptions = {} }) => {
  const apiBase = 'https://api-5cpqvpy3cq-uc.a.run.app';
  const token = auth.currentUser?.accessToken;
  const contentType =
    requestOptions?.method && requestOptions.method.toUpperCase() !== 'GET'
      ? { 'Content-Type': 'application/json' }
      : {};
  const updatedHeaders = {
    ...requestOptions?.headers,
    Authorization: token,
    ...contentType,
  };
  const updatedRequestOptions = { ...requestOptions, headers: updatedHeaders };
  const response = await fetch(
    `${apiBase}/${queryKey[0]}`,
    updatedRequestOptions,
  );
  if (!response.ok) {
    throw new Error(response.status);
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
