import { auth } from "../services/firebase";

// Define a default query function that will pathExcludedBaseUrl and fetch request options
export const defaultQueryFn = async ({ queryKey, requestOptions = {} }) => {
  const _apiBase = "https://api-5cpqvpy3cq-uc.a.run.app";
  const _token = auth.currentUser?.accessToken;
  const contentType =
    requestOptions?.method && requestOptions.method.toUpperCase() !== "GET"
      ? { "Content-Type": "application/json" }
      : {};
  const updatedHeaders = { ...requestOptions?.headers, Authorization: _token, ...contentType };
  requestOptions.headers = updatedHeaders;
  const response = await fetch(`${_apiBase}/${queryKey[0]}`, requestOptions);
  if (!response.ok) {
    throw new Error(response.status);
  }
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn("Trying to parse empty JSON response");
    return {};
  }
};

export { useGetCurrencies } from "./currencies";
export {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
  useGetTransactions,
  usePostTransaction,
} from "./transactions";
export { useGetUsers, useUpdateUser, useUpdateUserAvatar } from "./users";
