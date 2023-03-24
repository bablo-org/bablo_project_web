import { useHttp } from "./useHttp";

const useHomeApi = () => {
    const {loading, authorizedRequest, error} = useHttp();
    const _apiBase = 'https://api-5cpqvpy3cq-uc.a.run.app';

    const getUsers = async () => {
        const res = await authorizedRequest(`${_apiBase}/users`);
        return res.map(_transformUsers);
    }

    const getTransactions = async () => {
        const res = await authorizedRequest(`${_apiBase}/transactions`)
        return res.map(_transformedTransactions)
    }


    const _transformedTransactions = (transaction) => {
        return {
            id: transaction.id,
            sender: transaction.sender,
            reciever: transaction.reciever,
            currency: transaction.currency,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date,
            status: transaction.status,
            created: transaction.created,
            updated: transaction.updated
        }
    }

    const _transformUsers = (user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created: user.created
          }
    }
    return {loading, error, getUsers, getTransactions}
}

export default useHomeApi;
