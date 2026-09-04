const barcodeScanner = document.getElementById("barcode-scanner");
let scanner = null;

export async function scanCode(){
    return new Promise(async (resolve, reject) => {
    scanner = new Html5Qrcode("barcode-scanner");
 
    await scanner.start(
        { facingMode: "environment"},
        {
            fps: 10,
            qrbox: {
                width: 400,
                height: 150
            }
        },
        async (decodedText) => {
            console.log("Scanner erkannt: ", decodedText);
            await stop();
 
            barcodeScanner.replaceChildren();
 
            resolve(decodedText);
        }
    )})};

export async function stop(){
    if (!scanner) return;
    try{
        await scanner.stop();
        scanner.clear();
    } catch (e) {

    }

    scanner = null;


}