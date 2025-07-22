// filepath: c:\Users\USER\Desktop\Code\html\webproject\script.js
const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const moviesSection = document.getElementById('movies-section');
const form = document.getElementById('form');
const search = document.getElementById('query');

function fetchMovies(type = 'discover', query = '') {
    let url = `${BASE_URL}/${type}/movie?api_key=${API_KEY}`;
    if (type === 'search') {
        url += `&query=${query}`;
    } else {
        url += '&sort_by=popularity.desc';
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function displayMovies(movies) {
    moviesSection.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row';

    movies.forEach(movie => {
        const column = document.createElement('div');
        column.className = 'column';

        const card = document.createElement('div');
        card.className = 'card';

        const image = document.createElement('img');
        image.className = 'thumbnail';
        // Check if poster_path exists, if not use a placeholder
        if (movie.poster_path) {
            image.src = IMG_PATH + movie.poster_path;
        } else {
            image.src = 'image2.jpg';
        }
        image.alt = movie.title;

        const title = document.createElement('h3');
        title.textContent = movie.title;

        card.appendChild(image);
        card.appendChild(title);
        column.appendChild(card);
        row.appendChild(column);
    });

    moviesSection.appendChild(row);
}

// Load initial movies
fetchMovies()
    .then(data => {
        console.log('Movies loaded:', data);
        displayMovies(data.results);
    })
    .catch(error => {
        console.error('Error loading movies:', error);
        moviesSection.innerHTML = '<p>Error loading movies. Please try again later.</p>';
    });

// Handle search
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (searchTerm) {
        fetchMovies('search', searchTerm)
            .then(data => {
                displayMovies(data.results);
            })
            .catch(error => {
                console.error('Error searching movies:', error);
                moviesSection.innerHTML = '<p>Error searching movies. Please try again.</p>';
            });
        search.value = '';
    }
});