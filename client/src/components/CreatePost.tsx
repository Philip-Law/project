import React, { useState, useEffect, type ChangeEvent } from 'react'
import '../style/CreatePost.css'
import { useAuth0 } from '@auth0/auth0-react'
import { FaUpload } from 'react-icons/fa'

const CreatePost = (): React.ReactElement => {
  const { getAccessTokenSilently } = useAuth0()
  const [images, setImages] = useState<File[]>([])
  const [displayImages, setDisplays] = useState<Record<number, string>>({})
  const [imageError, setImageError] = useState<string>('')
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  // Define the processImage function outside of the useEffect hook
  // const processImage = (index: number): void => {
  //   const reader = new FileReader()
  //   reader.onload = (e) => {
  //     if (e.target?.result != null && typeof e.target.result === 'string') {
  //       const curTime = new Date().toISOString()
  //       const urlString = e.target.result.toString()
  //       setImages(prevState => ({
  //         ...prevState,
  //         [`${urlString}_${curTime}`]: index
  //       }))
  //       // newImages[`${e.target.result.toString()}_${curTime}`] = index
  //       // if (Object.keys(newImages).length === totalImages) {
  //       //   setDisplays(newImages)
  //       //   setIsLoading(false)
  //       // }
  //     }
  //   }
  //   reader.readAsDataURL(images[index])
  // }

  // // Inside the component
  // useEffect(() => {
  //   // setIsLoading(true)
  //   setDisplays({})
  //   // const newImages: Record<string, number> = {}
  //   const totalImages = images.length

  //   for (let i = 0; i < totalImages; i++) {
  //     processImage(i) // Call the processImage function for each image
  //   }
  // }, [images])

  useEffect(() => {
    // setIsLoading(true)
    setDisplays({})
    const newImages: Record<number, string> = {}
    const totalImages = images.length
    let imagesProcessed = 0
    for (let i: number = 0; i < images.length; i++) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result != null && typeof e.target.result === 'string') {
          newImages[i] = e.target.result.toString()
          imagesProcessed++
          if (imagesProcessed === totalImages) {
            setDisplays(newImages)
            // setIsLoading(false)
          }
        }
      }
      reader.readAsDataURL(images[i])
    }
  }, [images])

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    setImageError('')
    const files = event.target.files
    if (files != null) {
      const filesArray = Array.from(files)
      const maxSize = 10 * 1024 * 1024
      // const newImages: File[] = []

      if (filesArray.length + images.length > 4) {
        setImageError('Cannot upload more than 4 images.')
        if (event.target != null) {
          (event.target as HTMLInputElement).value = ''
        }
        return
      }

      filesArray.forEach((file: File) => {
        if (maxSize > file.size) {
          const reader = new FileReader()
          let fileURL: string = ''
          reader.onload = (e) => {
            if (e.target?.result != null && typeof e.target.result === 'string') {
              fileURL = e.target.result.toString()

              if (!Object.values(displayImages).includes(fileURL)) {
                setImages((images) => [...images, file])
              } else {
                setImageError('No duplicate files')
              }
            }
          }
          reader.readAsDataURL(file)
        } else {
          setImageError('File can be a maximum of 10mb')
        }
      })

      if (event.target !== undefined) {
        (event.target as HTMLInputElement).value = ''
      }
    }
  }

  const handleImageDelete = (event: React.MouseEvent<HTMLButtonElement>, index: number): void => {
    event.preventDefault()
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    const formData = {
      title: form.adTitle.value,
      adType: form.adType.value,
      description: form.description.value,
      location: form.location.value,
      categories: form.categories.value.split(/,\s*/),
      price: parseFloat(form.price.value as string)
    }

    let token: string
    try {
      token = await getAccessTokenSilently()
    } catch (e) {
      return
    }

    void fetch('http://localhost:8080/post/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(async response => {
        if (response.status !== 201) {
          console.error('Ad could not be posted')
        } else {
          const jsonResponse = await response.json()
          const postID = jsonResponse.postId
          void uploadImages(postID as string, token)
        }
      })
  }

  const uploadImages = async (postID: string, token: string): Promise<void> => {
    const formData = new FormData()
    images.forEach(image => {
      formData.append('post-images', image)
    })

    void fetch(`http://localhost:8080/post/image/upload/${postID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
      .then(async response => {
        if (!response.ok) {
          console.error('Images could not be uploaded')
        } else {
          window.location.href = `/listing/${postID}`
        }
      })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
        <div className='create-post'>
            <h2>Post An Ad</h2>
            <form id="adForm" onSubmit={(event) => { void handleCreatePost(event) }}>
                <label htmlFor="adTitle">Title:</label>
                <input type="text" id="adTitle" name="adTitle" required maxLength={200} onKeyDown={handleKeyDown}/>
                <br/>

                <label htmlFor="imageUpload" className="uploadLabel">Upload Images (up to 4):</label>
                <div id="imageUpload">
                        <div id="arrowWrapper">
                            <div id="uploadArrow"><FaUpload /></div>
                        </div>
                    <input type="file" id="adImages" name="adImages" multiple onChange={handleImageUpload}
                        accept="image/jpeg, image/jpg, image/png"/>
                </div>
                {(imageError !== '') && <div id="imageError">{imageError}</div>}
                <div id="imagePreview">

                  {Object.entries(displayImages).map(([key, value]) => (
                      <div key={key} className="uploadedImages">
                          <img key={key} src={value} />
                          <button onClick={(event) => { handleImageDelete(event, Number(key)) }}>X</button>
                      </div>
                  ))}

                </div>
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
