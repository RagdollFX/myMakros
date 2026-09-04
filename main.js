import * as Speicher from "./speicher.js"
import * as Suche from "./api.js"
import * as Render from "./render.js"
import * as Scanner from "./scanner.js"

let eintraege = Speicher.ladenEintraege();
let ziele = Speicher.ladenZiele();
const ergebnisse = document.getElementById("ergebnisse")
const form = document.getElementById("such-form");
const barcodeForm = document.getElementById("barcode-form");
const suchStatus = document.getElementById("such-status");
const tagesliste = document.getElementById("tagesliste");
const heute = new Date().toISOString().split("T")[0];
const aktuellesDatum = document.getElementById("aktuelles-datum");
const vorherigerTag = document.getElementById("vorheriger-tag");
const naechsterTag = document.getElementById("naechster-tag");
const heuteButton = document.getElementById("heute");
let angezeigterTag = heute;
const addButton = document.getElementById("add");
const pflButton = document.getElementById("profile");
const formPfl = document.getElementById("pflSettings");

let protGoal = "170";
let carbGoal = "50";
let fatGoal = "50";
let kalGoal = "2000";



function zeigeDatum(){
    const datum = new Date(angezeigterTag);

    aktuellesDatum.textContent = datum.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit"
    })
}

zeigeDatum();
Render.render(eintraege, ziele, heute);

const addContainer = document.querySelector(".add-container");
const pflContainer = document.getElementById("pfl-container");
const overlay = document.getElementById("overlay");

formPfl.addEventListener("submit", async(e) => {
    e.preventDefault();

    protGoal = formPfl.elements.gProt.value;
    carbGoal = formPfl.elements.gCarbs.value;
    fatGoal = formPfl.elements.gFat.value;
    kalGoal = formPfl.elements.gKalorien.value;
    ziele = { kalGoal, protGoal, carbGoal, fatGoal };

    ziele = {
        kalGoal,
        protGoal,
        carbGoal,
        fatGoal
    };

    Speicher.speichern(eintraege, ziele);
    Render.render(eintraege, ziele, angezeigterTag);
})

pflButton.addEventListener("click", () => {
    pflContainer.classList.remove("hidden");
    overlay.classList.remove("hidden");
    formPfl.elements.gProt.value = ziele.protGoal;
    formPfl.elements.gCarbs.value = ziele.carbGoal;
    formPfl.elements.gFat.value = ziele.fatGoal;
    formPfl.elements.gKalorien.value = ziele.kalGoal;
})

addButton.addEventListener("click", () => {
    addContainer.classList.remove("hidden");
    overlay.classList.remove("hidden");
})

overlay.addEventListener("click", () => {
    addContainer.classList.add("hidden");
    pflContainer.classList.add("hidden");
    overlay.classList.add("hidden");
    ergebnisse.replaceChildren();
    suchStatus.innerText = "";
    form.reset();
    Scanner.stop();
})

heuteButton.addEventListener("click", () => {
    angezeigterTag = heute;

    zeigeDatum();
    Render.render(eintraege, ziele, angezeigterTag);
})
vorherigerTag.addEventListener("click", () => {
    const datum = new Date(angezeigterTag);

    datum.setDate(datum.getDate()-1);

    angezeigterTag = datum.toISOString().split("T")[0];

    zeigeDatum();
    Render.render(eintraege, ziele, angezeigterTag)
})
naechsterTag.addEventListener("click", () => {
    const datum = new Date(angezeigterTag);

    datum.setDate(datum.getDate()+1);

    angezeigterTag = datum.toISOString().split("T")[0];

    zeigeDatum();
    Render.render(eintraege, ziele, angezeigterTag)
})

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const begriff = form.elements.begriff.value.trim();
  if (begriff === "") return;

  suchStatus.textContent = "Suche läuft…";
  try {
    const produkte = await Suche.sucheProdukte(begriff);
    Render.zeigeErgebnisse(produkte);
    suchStatus.textContent = `${produkte.length} Treffer`;
  } catch (err) {
    suchStatus.textContent = "Fehler: " + err.message;
  }
});

barcodeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let code = barcodeForm.elements.code.value;

    if(code === "") {
        code = await Scanner.scanCode();
        console.log(code);
    }

    suchStatus.textContent = "Suche läuft...";
    try{
        const produkt = await Suche.sucheCode(code);
        Render.zeigeErgebnisse([produkt]);
    }catch(err){
        suchStatus.textContent = "Fehler: " + err.message;
    }
})

ergebnisse.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if(!li) return;
    const produkt = li.dataset.name;
    const kcal100 = Number(li.dataset.kcal);
    const gramm = Number(prompt("Wie viel Gramm?", "100"));
    const protein = Number(li.dataset.protein);
    const carbs = Number(li.dataset.carbs);
    const fat = Number(li.dataset.fat);
    if(!gramm || gramm <= 0) return;
    eintraege.push({
        id: Date.now(),
        name: produkt,
        kcal100: kcal100,
        gramm: gramm,
        fat: fat,
        carbs: carbs,
        protein: protein,
        datum: new Date().toISOString().split("T")[0]
    });
    Speicher.speichern(eintraege, ziele);
    Render.render(eintraege, ziele, heute);
});

tagesliste.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if(!li) return;

    const id = Number(li.dataset.id);

    if(e.target.matches(".del")){
        eintraege = eintraege.filter(x => x.id !== id);
        Speicher.speichern(eintraege, ziele);
        Render.render(eintraege, ziele, heute);
        return;
    }
})


