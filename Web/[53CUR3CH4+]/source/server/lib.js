export const dev = process.argv.includes('--dev');

export const debug = (...args) => {
    console.log(...args);
};
