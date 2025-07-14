const cardContainer = document.getElementById("card-container");
const summaryContainer = document.getElementById("summary");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");

let totalSwipes = 0;
let maxSwipes = 15;
let likedCats = [];

function showNextCat() {
    if (totalSwipes >= maxSwipes) {
        showSummary();
        return;
    }

    const catUrl = `https://cataas.com/cat?${Date.now()}`; //Random cat
    const img = document.createElement("img");
    img.src = catUrl;
    img.alt = "Cat";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.draggable = false;

    img.addEventListener("dragstart", e => e.preventDefault());

    //Create overlay element to show heart or X during swipe
    window.overlay = document.createElement("div");
    overlay.classList.add("overlay");

    //Clear old image and insert new overlay + image
    cardContainer.innerHTML = "";
    cardContainer.appendChild(overlay);
    cardContainer.appendChild(img);

    //Swipe handling on the image
    let isDragging = false;
    let startX = 0;

    //Mobile touch start
    img.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    //Mobile touch end
    img.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > 50) showOverlayAndSwipe(diff > 0); // right = like, left = dislike
    });

    //Desktop mouse down
    img.addEventListener("mousedown", e => {
        isDragging = true;
        startX = e.clientX;
    });

    //Mouse move to detect swipe
    img.addEventListener("mousemove", e => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 50) {
            isDragging = false;
            showOverlayAndSwipe(diff > 0); // right = like, left = dislike
        }
    });

    //Mouse up and leave events reset dragging
    img.addEventListener("mouseup", () => {
        isDragging = false;
    });

    img.addEventListener("mouseleave", () => {
        isDragging = false;
    });

    //Show overlay and start swipe animation
    function showOverlayAndSwipe(liked) {
        overlay.textContent = liked ? '❤️' : '✖️';
        overlay.className = `overlay ${liked ? 'heart' : 'cross'}`;
        animateSwipe(img, liked);
    }
}

//Animate swipe left or right, then trigger handleSwipe
function animateSwipe(img, liked) {
    img.classList.add(liked ? "swipeRight" : "swipeLeft");
    img.addEventListener("animationend", () =>
        handleSwipe(liked));
}

//Handle the swipe logic: store if liked, update swipe count, load next cat
function handleSwipe(liked) {
    const currentImg = cardContainer.querySelector('img');
    if (liked && currentImg) {
        likedCats.push(currentImg.src); //Save the liked image URL
    }
    totalSwipes++;
    showNextCat();
}

//Show the summary
function showSummary() {
    cardContainer.style.display = "none";
    document.querySelector(".buttons").style.display = "none";
    summaryContainer.innerHTML = `<h2>You liked ${likedCats.length} cats!</h2>`;

    const grid = document.createElement("div");
    grid.className = "summary-grid";
    likedCats.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        grid.appendChild(img);
    });
    summaryContainer.appendChild(grid);

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    restartBtn.className = "restart-button";
    restartBtn.addEventListener("click", restartApp);
    summaryContainer.appendChild(restartBtn);
}

//Restart the app to swipe again
function restartApp() {
    likedCats = [];
    totalSwipes = 0;
    summaryContainer.innerHTML = "";
    cardContainer.style.display = "block";
    document.querySelector(".buttons").style.display = "flex";
    showNextCat();
}

// Button events
likeBtn.addEventListener("click", () => {
    const img = cardContainer.querySelector('img');
    const overlay = cardContainer.querySelector('.overlay');
    if (img && overlay) {
        overlay.textContent = '❣️';
        overlay.className = 'overlay heart';
        animateSwipe(img, true);
    }
});
dislikeBtn.addEventListener("click", () => {
    const img = cardContainer.querySelector('img');
    const overlay = cardContainer.querySelector('.overlay');
    if (img && overlay) {
        overlay.textContent = '✖️';
        overlay.className = 'overlay cross';
        animateSwipe(img, false);
    }
});

showNextCat();
