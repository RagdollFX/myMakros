export function speichern(eintraege, ziele) {
  localStorage.setItem("eintraege", JSON.stringify(eintraege));
  localStorage.setItem("ziele", JSON.stringify(ziele));
}

export function ladenEintraege() {
  const daten = localStorage.getItem("eintraege");
  if (daten === null) return [];

  try {
    const geparst = JSON.parse(daten);
    return Array.isArray(geparst) ? geparst : [];
  } catch (err) {
    console.warn("Speicherpunkt unlesbar, starte leer", err);
    return [];
  }
}

export function ladenZiele(){
  const daten = localStorage.getItem("ziele");
  if (daten == null) {
    return {
      kalGoal: 2000,
      protGoal: 170,
      carbGoal: 50,
      fatGoal: 50
    };
  }

  try{
    return JSON.parse(daten);
  } catch (err){
    console.warn("Ziele unlesbar, starte leer", err);
    return {
      kalGoal: 2000,
      protGoal: 170,
      carbGoal: 50,
      fatGoal: 50
    };
  }
}