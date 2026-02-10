import { API_BASE } from '../config'

export const AddToWatchList = async (movieId) => {
    const token = localStorage.getItem('token')

    try {
        const response = await fetch(API_BASE + '/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({movieId: movieId})
        })


     return (response.status === 201 || response.status === 409)

    } catch (error) {
        console.log('error', error)
        return false;
    }
}