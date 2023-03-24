import { useState, useCallback } from "react";
import { auth } from "../services/firebase";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const _token = auth.currentUser?.accessToken;

    const authorizedRequest = useCallback(async (url, requestOptions = {}) => {
        setError(false);
        setLoading(true);
        const updatedHeaders = {...requestOptions?.headers, 'Authorization': _token};
        requestOptions.headers = updatedHeaders;

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error (response.status);
            }

            const data = await response.json();
            setError(false);
            return data;
 
        } catch(e){
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [])

    return {loading, authorizedRequest, error}
}

// method = 'GET', body = null, headers = {'Content-Type' : 'application/json'}