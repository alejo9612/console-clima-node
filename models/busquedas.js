const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbpath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => { //registro de historial con metodo map

            let palabras = lugar.split(' ');

            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1)); //retornar la primera letra en mayuscula con el resto de las palabras para que queden capitalizadas

            return palabras.join(' '); // lo unimos de nuevo con el '' que le cortamos
        });
    }

    get paramsMapBox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get OPENWEATHER() {

        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async ciudad(lugar = '') { // metodo para buscar el lugar que deseamos ver sus cordenadas

        try {
            //petición HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({ // destructuració de donde encontramos los datos que necesitamos de la data
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0], //se toma la posición ya que contiene los datos en un array
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
        //console.log('Ciudad', lugar);
    }

    async ClimaLugar(lat, lon) { // método para poder optener los datos que necesitamos del clima

        try {

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.OPENWEATHER, lat, lon } // destructuración para poder tomas la longitud y la latitud
            });

            const respuesta = await instance.get();
            const { weather, main } = respuesta.data; //destructuración de la data para obtener los datos que necesitamos del la misma

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') { //metodo para agregar la consulta al historial que tenemos

        //prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) { //si ya esta en el historial retormemelo
            return
        }
        //mantener solo los 6 primeros registros como historial mas no
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase()); //en caso contrario creeelo y coloquelo en el primer lugar

        //guardar en la base de datos
        this.guardarDB();
    }

    guardarDB() { //metodo para poder almacenar en la base de datos json

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbpath, JSON.stringify(payload)); //almacenamos el historial en la base de datos
    }

    leerDB() {

        if (!fs.existsSync(this.dbpath)) return; //si es difernete a lo que tenemos en la base de datos

        const info = fs.readFileSync(this.dbpath, { encoding: 'utf-8' }); //leemos la base de datos que tenemos creada
        const data = JSON.parse(info); // la parseamos para poder verla

        this.historial = data.historial; //indicamos que es lo que tendremos en este historial
    }

}
module.exports = Busquedas;