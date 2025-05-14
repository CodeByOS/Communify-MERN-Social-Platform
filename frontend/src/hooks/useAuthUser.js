import React from 'react'
import { getAuthUser } from '../lib/api'
import { useQuery } from '@tanstack/react-query'

const useAuthUser = () => {
    //* Tanstack query
    //* get => useQuery
    const authUser = useQuery({ 
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false, //* Disable retrying on failure (e.g., for auth checks)
    });

    return {
        isLoading: authUser.isLoading,
        authUser: authUser.data?.user,
    }
}

export default useAuthUser