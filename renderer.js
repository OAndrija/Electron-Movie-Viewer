function openSettings() {
    window.electronAPI.openSettings();
}

window.electronAPI.onThemeChanged((theme) => {
    document.getElementById('theme-style').href = `styles/style-${theme}.css`;
});
