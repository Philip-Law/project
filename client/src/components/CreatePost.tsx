import React, { useState, useRef } from 'react'
import '../style/CreatePost.css'
import { useAuth0 } from '@auth0/auth0-react';

const CreatePost = (): React.ReactElement => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const handleCreatePost = (async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement

        const formData = {
            title: form.adTitle.value,
            adType: form.adType.value,
            description: form.description.value,
            location: form.location.value,
            categories: form.categories.value.split(/,\s*/),
            price: parseFloat(form.price.value)
        }

        let token: string
        try {
            token = await getAccessTokenSilently()
            console.log(user?.sub)
          } catch (e) {
            console.log(e)
            return
        }

        fetch(`http://localhost:8080/user/${user?.sub}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error('User not found')
            }
            return response.json()
        })

        fetch('http://localhost:8080/post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                console.log(token)
                console.error('Ad could not be posted')
            }
            return response.json()
        })
    })

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div className='create-post'>
            <h2>Post An Ad</h2>
            <form id="adForm" onSubmit={handleCreatePost}>
                <label htmlFor="adTitle">Title:</label>
                <input type="text" id="adTitle" name="adTitle" required maxLength={200} onKeyDown={handleKeyDown}/>
                <br/>

                <label htmlFor="adType">Ad Type:</label>
                <select id="adType" name="adType" required>
                    <option value="S">Selling</option>
                    <option value="W">Wanted</option>
                    <option value="A">Academic Service</option>
                </select>
                <br/>

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" required></textarea>
                <br/>

                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location" required onKeyDown={handleKeyDown}/>
                <br/>

                <label htmlFor="categories">Categories:</label>
                <input type="text" id="categories" name="categories" required onKeyDown={handleKeyDown}/>
                <br/>

                <label htmlFor="price">Price:</label>
                <input type="number" id="price" name="price" required min="0" step="0.01" onKeyDown={handleKeyDown}/>
                <br/>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreatePost