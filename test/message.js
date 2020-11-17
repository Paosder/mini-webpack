import { name } from './name.js';

export const decorateName = (decorator) => {
    return `${decorator}, ${name}!`;
}