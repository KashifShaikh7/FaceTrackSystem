export function bindButton(id, callback) {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", callback);
}
