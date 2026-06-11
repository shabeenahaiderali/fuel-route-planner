const currentPrices = require("./data/currentPrices.json");

async function processQuestion(message) {
  const q = message.toLowerCase();

  // Petrol
  if (q.includes("petrol")) {
    const fuel = currentPrices.find(f => f.fuel_name === "Petrol");
    return `⛽ Petrol price is Rs ${fuel.price_pkr}`;
  }

  // Cheapest
  if (q.includes("cheapest") || q.includes("sasta")) {
    const cheapest = [...currentPrices].sort((a,b) => a.price_pkr - b.price_pkr)[0];
    return `🟢 Cheapest fuel is ${cheapest.fuel_name} at Rs ${cheapest.price_pkr}`;
  }

  // Most expensive
  if (q.includes("expensive") || q.includes("mehnga")) {
    const expensive = [...currentPrices].sort((a,b) => b.price_pkr - a.price_pkr)[0];
    return `🔴 Most expensive fuel is ${expensive.fuel_name} at Rs ${expensive.price_pkr}`;
  }

  return "❌ Please ask fuel-related question";
}

module.exports = processQuestion;

const axios = require("axios");
const currentPrices = require("./data/currentPrices.json");

async function getDistance(from, to) {
  try {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from},Pakistan&destinations=${to},Pakistan&key=${apiKey}`;

    const res = await axios.get(url);

    const distanceInMeters = res.data.rows[0].elements[0].distance.value;

    return distanceInMeters / 1000; // km
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function processQuestion(message) {
  const q = message.toLowerCase();

  const cities = ["karachi","lahore","islamabad","multan","peshawar","faisalabad","quetta"];

  let fromCity = cities.find(c => q.includes(c));
  let toCity = cities.find(c => q.includes(c) && c !== fromCity);

  if (fromCity && toCity) {

    const distance = await getDistance(fromCity, toCity);

    if (!distance) {
      return `❌ Distance not found between ${fromCity} and ${toCity}`;
    }

    const petrol = currentPrices.find(f => f.fuel_name === "Petrol");

    const mileage = 15; // km/l

    const fuelNeeded = distance / mileage;
    const cost = fuelNeeded * petrol.price_pkr;

    return `
🚗 Smart Route AI

📍 From: ${fromCity}
📍 To: ${toCity}

📏 Distance: ${distance.toFixed(2)} km  
⛽ Fuel Needed: ${fuelNeeded.toFixed(2)} L  
💰 Estimated Cost: Rs ${cost.toFixed(2)}
    `;
  }

  return "Ask like: Lahore to Karachi fuel cost?";
}

if (fromCity && toCity) {

  const distance = await getDistance(fromCity, toCity);

  const petrol = currentPrices.find(f => f.fuel_name === "Petrol");
  const cng = currentPrices.find(f => f.fuel_name === "CNG");

  const mileagePetrol = 15;
  const mileageCNG = 22;

  const petrolCost = (distance / mileagePetrol) * petrol.price_pkr;
  const cngCost = (distance / mileageCNG) * cng.price_pkr;

  const best = petrolCost < cngCost ? "Petrol" : "CNG";
  const bestCost = Math.min(petrolCost, cngCost);

  return `
🚗 Route AI Analysis

📏 Distance: ${distance.toFixed(2)} km

⛽ Petrol Cost: Rs ${petrolCost.toFixed(2)}
⛽ CNG Cost: Rs ${cngCost.toFixed(2)}

🏆 Cheapest Option: ${best}
💰 Minimum Cost: Rs ${bestCost.toFixed(2)}
  `;
}