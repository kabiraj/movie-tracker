
export const AddToWatchList = async (movieId) => {
    const token = localStorage.getItem('token')

    try {
        const response = await fetch('http://localhost:3000/movies', {
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