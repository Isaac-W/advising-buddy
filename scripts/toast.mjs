export default function toast(message, type = "") {
    Toastify({
        text: message,
        duration: 2500,
        gravity: "bottom",
        position: "center",
        className: type ? `toast-${type}` : "",
    }).showToast();
}
