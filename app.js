require('dotenv').config()
const { readInput, pauseMenu, menuColors, listarLugares } = require("./helpers/inquirer");
const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas();
    let opcion;


    do {

        opcion = await menuColors();

        switch (opcion) {
            case 1:
                //mostrar mensaje
                const termmino = await readInput('Ciudad: ');
                //Buscar lugares
                const lugares = await busquedas.ciudad(termmino);
                //Seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);
                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);
                //Clima
                const Clima = await busquedas.ClimaLugar(lugarSel.lat, lugarSel.lng);
                //Mostrar resultados
                console.clear();
                console.log('\nInformación del lugar\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Latitud:', lugarSel.lat);
                console.log('Longitud:', lugarSel.lng);
                console.log('Temperatura:', Clima.temp);
                console.log('Mínima:', Clima.min);
                console.log('Máxima:', Clima.max);
                console.log('Como está el clima actualmente:', Clima.desc.green);
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => { //recorremos la busqueda con su historial dandole como argumento el lugar
                    const idx = `${i+1}.`.yellow;
                    console.log(`${idx} ${lugar}`);
                });
                break;

        }

        if (opcion !== 0) await pauseMenu();

    } while (opcion !== 0);

}

main();