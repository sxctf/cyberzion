import qs from 'qs';

const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

let theme = typeof query.theme === 'string' ? query.theme : '/light.css';
if (!theme.startsWith('/') && !theme.startsWith('http')) theme = '/' + theme;
if (!theme.endsWith('.css')) theme += '.css';

const style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', theme);
document.head.appendChild(style);
