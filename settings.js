const radios = document.querySelectorAll('input[name="theme"]');

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
        window.electronAPI.setTheme(selectedTheme);
    });
});

window.electronAPI.onThemeChanged((theme) => {
    document.getElementById('theme-style').href = `styles/style-${theme}.css`;
    document.querySelector(`input[value="${theme}"]`).checked = true;
});
