/**
 * Converts a relative file path to an absolute file path
 * @param {string} relative - The relative file path
 * @returns {URL} - The absolute file path
 */
function relativeToAbsolutePath(relative) {
    return new URL(relative, window.location.href).href;
}