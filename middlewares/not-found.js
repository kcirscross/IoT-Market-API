export const notFoundMiddleware = (req, res) => res.sendFile('index.html', { root: 'errors/error_not_found_page' });
