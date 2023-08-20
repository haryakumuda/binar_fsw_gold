// Sample user data
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    profilePicture: "https://example.com/john.jpg",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    profilePicture: "https://example.com/jane.jpg",
  },
  {
    name: "Harya Kumuda",
    email: "jane@example.com",
    profilePicture: "https://example.com/jane.jpg",
  },
  // Add more users as needed
];

// Function to create a User Card and populate it with data
function createUserCard(user) {
  const userCard = document.createElement("div");
  userCard.classList.add("user-card");

  const nameElement = document.createElement("div");
  nameElement.classList.add("user-name");
  nameElement.textContent = user.name;

  const emailElement = document.createElement("div");
  emailElement.classList.add("user-email");
  emailElement.textContent = user.email;

  const profilePictureElement = document.createElement("img");
  profilePictureElement.setAttribute("src", user.profilePicture);
  profilePictureElement.setAttribute("alt", user.name);

  userCard.appendChild(nameElement);
  userCard.appendChild(emailElement);
  userCard.appendChild(profilePictureElement);

  return userCard;
}

// Get the container to hold the User Cards
const userCardContainer = document.getElementById("content");

// Loop through the users and create a User Card for each user
users.forEach((user) => {
  const userCard = createUserCard(user);
  userCardContainer.appendChild(userCard);
});
