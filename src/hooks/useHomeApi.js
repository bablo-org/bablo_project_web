import { useHttp } from "./useHttp";

const useHomeApi = () => {
    const {loading, authorizedRequest, error} = useHttp();
    const _apiBase = 'https://api-5cpqvpy3cq-uc.a.run.app';

    const getUsers = async () => {
        const res = await authorizedRequest(`${_apiBase}/users`);
        return res.map(_transformUsers);
    }

    const _transformUsers = (user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created: user.created
          }
    }
    return {loading, error, getUsers}
}

export default useHomeApi;
