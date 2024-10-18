// Scroll to "Adopt Your Best Friend" section when "View More" is clicked
document.getElementById('view-more').addEventListener('click', function () {
    const adoptSection = document.getElementById('adopt-section');
    adoptSection.scrollIntoView({ behavior: 'smooth' });
});

// fetch categories
const loadCategories = () => {
    fetch(`https://openapi.programming-hero.com/api/peddy/categories`)
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.error(error))
}

// display categories
const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("categories-container");
    categories.forEach((item) => {
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `<button id="btn-${item.category}" onclick="handleSpinner('${item.category}')" class="btn category-btn">
    <img class="w-4 md:w-7" src="${item.category_icon}" alt="">
    <h2 class="font-bold text-base lg:text-xl">${item.category}</h2>
    </button>`
        categoriesContainer.appendChild(buttonContainer);
    })
}
// handle spinner
const handleSpinner = (categoryId) => {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("pet-section").classList.add("hidden");
    setTimeout(function () {
        loadCategory(categoryId);
    }, 2000)
}
// load category
const loadCategory = async (id) => {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("pet-section").classList.remove("hidden");
    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`);
    const data = await response.json();

    const activeBtn = document.getElementById(`btn-${id}`);
    // remove all active class
    removeActiveClass();
    // add active class
    activeBtn.classList.add("active");
    displayPets(data.data);
};
// remove active button function
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
}
// fetch pets
let allPets = [];
const loadPets = () => {

    fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
        .then((res) => res.json())
        .then((data) => {
            allPets = data.pets;
            displayPets(allPets);
        })
        .catch((error) => console.error(error))
}

// display Pets
const displayPets = (pets) => {
    const petContainer = document.getElementById("pet-container");
    petContainer.innerHTML = "";
    // condition for no data in any category
    if (pets.length === 0) {
        petContainer.classList.remove("grid");
        petContainer.innerHTML = `
        <div class="flex flex-col justify-center items-center border rounded-xl py-14 space-y-2 bg-gray-50">
            <img src="./images/error.webp" />
            <h2 class="font-bold text-3xl">No Information Available</h2>
            <p class="text-[#131313B3]">Sorry no data found on this category. Please check other categories.</p>
        </div>
        `;
        return;
    } else {
        petContainer.classList.add("grid");
    }

    pets.forEach((pet) => {
        const card = document.createElement("div");
        card.classList = "p-3 border rounded-lg space-y-3";
        card.innerHTML = `<img class="w-full rounded-lg object-cover" src="${pet.image}">
        <h2 class="font-extrabold text-2xl">${pet.pet_name || 'Unknown Name'}</h2>
        <div class="flex gap-2 items-center">
            <img class="w-6" src="./images/breed.png"/>
            <span>Breed: ${pet.breed || 'Unknown Breed'}</span>
        </div>
        <div class="flex gap-2 items-center">
            <img class="w-6" src="./images/date.png"/>
            <span>Birth: ${pet.date_of_birth || 'Unknown date'}</span>
        </div>
        <div class="flex gap-2 items-center">
            <img class="w-6" src="./images/gender.png"/>
            <span>Gender: ${pet.gender || 'Unknown gender'}</span>
        </div>
        <div class="flex gap-2 items-center pb-3 border-b">
            <img class="w-6" src="./images/dolar.png"/>
            <span>Price: $ ${pet.price || 'Price is not fixed'}</span>
        </div>
        <div class="flex items-center justify-center gap-2">
            <button onclick= "sidebarDisplay('${pet.image}')" class="w-1/4 btn border-[#0E7A81]"><img class="" src="./images/like.png"/></button>
            <button class="w-1/3 btn border-[#0E7A81] text-[#0E7A81] text-lg font-semibold" onclick="adoptPet(this)">Adopt</button>
            <button onclick="loadPetDetails('${pet.petId}')" class="w-1/3 btn border-[#0E7A81] text-[#0E7A81] text-lg font-semibold">Details</button> 
        </div>
      `;
        petContainer.appendChild(card);
    })
}
// Sort pets by price
const sortByPrice = () => {
    handleSpinner();
    const sortedPets = allPets.sort((a, b) => b.price - a.price);
    displayPets(sortedPets);
};

// Event listener for the sort button
document.getElementById('sort-button').addEventListener('click', sortByPrice);

//function to handle pet adoption
// Adopt Pet Functionality
const adoptPet = (button) => {
    const countdown = 3;
    let timeLeft = countdown;

    // Update the countdown message in the modal
    const countdownMessage = document.getElementById("countdown-message");
    countdownMessage.innerText = `${timeLeft}`;

    const adoptModal = document.getElementById("adoptModal");
    adoptModal.showModal();

    // Start the countdown interval
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownMessage.innerText = `${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            button.innerText = "Adopted";
            button.disabled = true;
            adoptModal.close();
        }
    }, 1000);
};


// load pet details
const loadPetDetails = async (petId) => {
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayPetDetails(data.petData);

}
// display pet details
const displayPetDetails = (petDetail) => {
    console.log(petDetail);
    const detailContainer = document.getElementById("modal-content");
    detailContainer.innerHTML = `
        <img class="w-full rounded-lg object-cover" src="${petDetail.image}" alt="">
        <h2 class="font-extrabold text-2xl mt-2">${petDetail.pet_name || 'Unknown Name'}</h2>
        <div class="grid grid-cols-2 pb-3 border-b">
            <div class="flex gap-2 items-center">
                <img class="w-6" src="./images/breed.png"/>
                <span>Breed: ${petDetail.breed || 'Unknown Breed'}</span>
            </div>
            <div class="flex gap-2 items-center">
                <img class="w-6" src="./images/date.png"/>
                <span>Birth: ${petDetail.date_of_birth || 'Unknown date'}</span>
            </div>
            <div class="flex gap-2 items-center">
                <img class="w-6" src="./images/gender.png"/>
                <span>Gender: ${petDetail.gender || 'Unknown gender'}</span>
            </div>
            <div class="flex gap-2 items-center">
                <img class="w-6" src="./images/dolar.png"/>
                <span>Price: $ ${petDetail.price || 'Price is not fixed'}</span>
            </div>
            <div class="flex gap-2 items-center">
                <img class="w-6" src="./images/vaccin.png"/>
                <span>Vaccinated stats: ${petDetail.vaccinated_status || 'Unknown'}</span>
            </div>
        </div>   
        <div class="pt-3">
            <h2 class="font-bold text-xl mb-2">Details Information</h2>
            <p>${petDetail.pet_details || 'No details found'}</p>
        </div>
    `;
    document.getElementById("customModal").showModal();
}

// sidebar card display
const sidebarDisplay = (images) => {
    const sideBarConatiner = document.getElementById("sidebar-container");
    sideBarConatiner.classList.add("border", "rounded-lg");
    const image = document.createElement("div");
    image.classList = "p-1";
    image.innerHTML = `<img class="w-full rounded-lg object-cover" src="${images}" alt="">`;
    sideBarConatiner.appendChild(image);
}

// function call
loadCategories()
loadPets()