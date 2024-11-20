const req = require.context('./glyphs');
export const iconsDir = {};

req.keys().forEach(filename => {
    const { id, viewBox, node } = req(filename).default;
    iconsDir[id] = { viewBox, label: node?.ariaLabel || '' };
});
