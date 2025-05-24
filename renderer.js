function openSettings() {
    window.electronAPI.openSettings();
}

window.electronAPI.onThemeChanged((theme) => {
    document.getElementById('theme-style').href = `styles/style-${theme}.css`;
});

window.electronAPI.onRequestUpload(() => {
    window.electronAPI.requestOpenDialog();
});

window.electronAPI.onMovieDataLoaded((movie) => {
    document.querySelector('.movie-title').textContent = movie.title;
    document.querySelector('.year').textContent = movie.year;
    document.querySelector('.director').textContent = movie.director.join(', ');
    document.querySelector('.score').textContent = movie.score;
    document.querySelector('.summary').textContent = movie.summary;
    document.querySelector('.cast').innerHTML = `<strong>Cast:</strong> ${movie.cast.join(', ')}`;

    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = '';
    movie.categories.forEach(cat => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = cat;
        categoriesContainer.appendChild(span);
    });

    document.querySelector('.poster img').src = movie.imagePath;
    document.querySelector('.background-blur img').src = movie.imagePath;
    document.querySelector('.trailer iframe').src = movie.trailerUrl;
});
