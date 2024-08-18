import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from './components/ImageModal/ImageModal';
import './App.css';

const API_KEY = 'wbB7YEXF0pq-3PWq_kDrvmAaoaKHr6r5vdEDCtH8JK0';

const App = () => {
    const [images, setImages] = useState([]);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (!query) return;

        const fetchImages = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get('https://api.unsplash.com/search/photos', {
                    params: {
                        query,
                        page,
                        per_page: 12,
                    },
                    headers: {
                        Authorization: `Client-ID ${API_KEY}`,
                    },
                });

                if (response.data.results.length === 0) {
                    toast.error('No images found for this query');
                } else {
                    setImages(prevImages => [...prevImages, ...response.data.results]);
                }
            } catch (error) {
                setError('Failed to fetch images');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [query, page]);

    const handleSearch = (newQuery) => {
        setQuery(newQuery);
        setImages([]);
        setPage(1);
    };

    const loadMoreImages = () => {
        setPage(prevPage => prevPage + 1);
    };

    const openModal = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="App">
            <SearchBar onSubmit={handleSearch} />
            {error && <ErrorMessage message={error} />}
            {images.length > 0 && (
                <ImageGallery images={images} onImageClick={openModal} />
            )}
            {isLoading && <Loader />}
            {images.length > 0 && !isLoading && (
                <LoadMoreBtn onClick={loadMoreImages} />
            )}
            <ImageModal isOpen={!!selectedImage} onClose={closeModal} image={selectedImage} />
            <Toaster position="top-right" />
        </div>
    );
};

export default App;