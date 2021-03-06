const inquirer = require('inquirer');
require('colors');


const questions = [{ // listado de lo que deseamos ver en el menu
    type: 'list',
    name: 'select',
    message: 'Que deseas hacer?'.green,
    choices: [{
            value: 1,
            name: `${'1'.yellow} Buscar ciudad`
        },
        {
            value: 2,
            name: `${'2'.yellow} Historial de busqueda`
        },
        {
            value: 0,
            name: `${'0'.yellow} Salir`
        },
    ]

}];


const menuColors = async() => { //metodo del menu que vemos

    console.clear();
    console.log('====================================================='.yellow);
    console.log(`${'='.yellow} ${'Seleccione alguna de nuestras opciones por favor'.green} ${'='.yellow}`);
    console.log('====================================================='.yellow);

    const { select } = await inquirer.prompt(questions);
    return select;

}

const pauseMenu = async() => { // funcion de pausa para que nos perita avanzar de a poco sin que nos afecte el ciclo do while

    const seleccion = [{ // indica el tipo de dato que debemos de ingresar tras la pausa
        type: 'Input',
        name: 'check',
        message: ` Presione la tecla ${'ENTER'.red} para poder continuar`
    }];

    console.log('\n');
    await inquirer.prompt(seleccion); // llamamos la pregunta seleccionada desde la constante que se declaro 
}
const readInput = async(message) => { // funcion asincrona con valor de message para leer el input ingresado

    const question = [{
        type: 'input',
        name: 'descrip',
        message,
        validate(value) { //logica de validacion de lo que ingresa el usuario
            if (value.length === 0) {
                return 'Por favor ingrese un valor';
            }
            return true;
        }
    }];

    const { descrip } = await inquirer.prompt(question); //desctructuración de lo que desea hacer el usuario
    return descrip;
}

const showListCheckList = async(tareas = []) => { //funció para mostrar la lista que tenemos de tareas y poder seleccionarlas para su completación

    const choices = tareas.map((tarea, i) => { // costante de los choices que tenemos por tareas

        const index = `${i+1}.`.yellow;

        return {
            value: tarea.id,
            name: `${index} ${tarea.descrip}`,
            checked: (tarea.completeOn) ? true : false
        }
    });

    const preguntas2 = [{
        type: 'checkbox',
        name: 'ids',
        message: 'selecciona',
        choices
    }]

    const { ids } = await inquirer.prompt(preguntas2); // identificación mediate el id de la tarea
    return ids;
}

const listarLugares = async(lugares = []) => { // validamos los lugares que vamos a recorer

    const choices = lugares.map((lugar, i) => {

        const index = `${i+1}.`.yellow; //creamos el indice que vamos a validar

        return { //retornamos el valor que necesitamos discriminado por id 
            value: lugar.id,
            name: `${index} ${lugar.nombre}`
        }
    });

    choices.unshift({ // enviamos una opción adicional al principio para tener la opción de cancelar la operación
        value: '0',
        name: '0.'.red + 'CANCELAR OPERACIÓN'
    });

    const question2 = [{
        type: 'list',
        name: 'id',
        message: 'Selecciona el lugar:',
        choices
    }];

    const { id } = await inquirer.prompt(question2);
    return id;
}

const confirm = async(message) => { // funció para confirmar la eliminación de  la tarea

    const question3 = [{
        type: 'confirm',
        name: 'ok',
        message
    }];

    const { ok } = await inquirer.prompt(question3);
    return ok;
}


module.exports = {
    menuColors,
    pauseMenu,
    readInput,
    showListCheckList,
    confirm,
    listarLugares
}