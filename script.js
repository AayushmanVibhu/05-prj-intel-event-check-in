const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

let count = 0;
const maxCount = 50;
let attendees = [];
let teamCounts = { water: 0, zero: 0, power: 0 };

// Load data from localStorage on page load
function loadFromStorage() {
  const savedCount = localStorage.getItem("attendeeCount");
  const savedTeamCounts = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");

  if (savedCount) {
    count = parseInt(savedCount);
    document.getElementById("attendeeCount").textContent = count;
    updateProgressBar();
  }

  if (savedTeamCounts) {
    teamCounts = JSON.parse(savedTeamCounts);
    document.getElementById("waterCount").textContent = teamCounts.water;
    document.getElementById("zeroCount").textContent = teamCounts.zero;
    document.getElementById("powerCount").textContent = teamCounts.power;
  }

  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
    displayAttendeeList();
  }
}

// Save data to localStorage
function saveToStorage() {
  localStorage.setItem("attendeeCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Update progress bar
function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;
  progressBar.textContent = `${percentage}%`;
  console.log(`Progress: ${percentage}%`);
}

// Display attendee list
function displayAttendeeList() {
  const attendeeListElement = document.getElementById("attendeeList");
  if (!attendeeListElement) {
    return;
  }

  attendeeListElement.innerHTML = "";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("div");
    listItem.className = "attendee-item";
    listItem.innerHTML = `<span class="attendee-name">${attendee.name}</span> <span class="attendee-team">${attendee.teamName}</span>`;
    attendeeListElement.appendChild(listItem);
  });
}

// Show celebration when goal is reached
function showCelebration() {
  const greeting = document.getElementById("greeting");

  // Find winning team
  let winningTeam = "water";
  let maxTeamCount = teamCounts.water;

  if (teamCounts.zero > maxTeamCount) {
    winningTeam = "zero";
    maxTeamCount = teamCounts.zero;
  }
  if (teamCounts.power > maxTeamCount) {
    winningTeam = "power";
    maxTeamCount = teamCounts.power;
  }

  const teamNames = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables",
  };

  const celebrationMessage = `🎉 Congratulations! We reached our goal of ${maxCount} attendees! ${teamNames[winningTeam]} wins with ${maxTeamCount} members! 🎉`;

  greeting.textContent = celebrationMessage;
  greeting.style.display = "block";
  greeting.className = "success-message celebration";
  console.log(celebrationMessage);
}

// Load data when page loads
loadFromStorage();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  // Update total attendee count
  count++;
  console.log("Total check-ins: ", count);
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  // Update team count
  teamCounts[team]++;
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = teamCounts[team];

  // Add to attendee list
  attendees.push({ name: name, team: team, teamName: teamName });
  displayAttendeeList();

  // Check if goal is reached
  if (count >= maxCount) {
    showCelebration();
  } else {
    // Show greeting message
    const greeting = document.getElementById("greeting");
    const message = `Welcome, ${name} from team ${teamName}!`;
    greeting.textContent = message;
    greeting.style.display = "block";
    greeting.className = "success-message";
    console.log(message);
  }

  // Update progress bar
  updateProgressBar();

  // Save to localStorage
  saveToStorage();

  // Reset form
  form.reset();
});
