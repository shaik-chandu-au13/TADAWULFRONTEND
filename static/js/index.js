function openModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    var button = document.getElementById("button");
    button.classList.add("selected");
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
    var button = document.getElementById("button");
    button.classList.remove("selected");
}

