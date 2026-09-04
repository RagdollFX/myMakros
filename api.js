export async function sucheProdukte(begriff) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(begriff)}&search_simple=1&action=process&json=1&page_size=10&countries_tags_en=germany&fields=code,product_name,brands,nutriments`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const daten = await response.json();

  return daten.products.filter(p =>
    p.product_name && p.nutriments?.["energy-kcal_100g"]
  );
}

export async function sucheCode(code){
    const url = `https://world.openfoodfacts.org/api/v2/product/${code}`;

    const response = await fetch(url);
    const daten = await response.json();
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    if (daten.status !== 1) {
        throw new Error("Produkt nicht gefunden");
    }

    return daten.product;
}

