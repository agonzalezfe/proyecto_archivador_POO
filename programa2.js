class Laboratorio {
    constructor(nombre) {
        this.nombre = nombre;
        this.pacientes = [];
        this.pruebas_realizadas = [];
    }

    agregarPaciente(paciente) {
        this.pacientes.push(paciente);
    }

    realizarPrueba(paciente, prueba) {
        let valor_prueba = prueba.valor;
        if (paciente.sisben == 'A') {
            valor_prueba -= valor_prueba * prueba.descuento_sisben.A;
        } else if (paciente.sisben == 'B1') {
            valor_prueba -= valor_prueba * prueba.descuento_sisben.B1;
        } else if (paciente.sisben == 'B2') {
            valor_prueba -= valor_prueba * prueba.descuento_sisben.B2;
        } else {
            throw new Error('El valor de sisben debe ser "A", "B1" o "B2"');
        }
        if (paciente.salario > 1300000*3) {
            let minimos_adicionales = paciente.salario/1300000*3;

            valor_prueba += valor_prueba * 0.1 * minimos_adicionales;
            this.pruebas_realizadas.push({ paciente: paciente, prueba: prueba, valor: valor_prueba });
        }
    }

    calcularIngresosTotales() {
        let total = 0;
        for (let i = 0; i < this.pruebas_realizadas.length; i++) {
            total += this.pruebas_realizadas[i].valor;
        }
        return total;
    }

    calcularIngresosPorRegimen(regimen) {
        let total = 0;
        for (let i = 0; i < this.pruebas_realizadas.length; i++) {
            if (this.pruebas_realizadas[i].paciente.sisben == regimen) {
                total += this.pruebas_realizadas[i].valor;
            }
        }
        return total;
    }

    obtenerTiposPruebasConIngresos() {
        let tiposPruebas = {};
        for (let i = 0; i < this.pruebas_realizadas.length; i++) {
            const prueba = this.pruebas_realizadas[i];
            if (!tiposPruebas[prueba.prueba.tipo]) {
                tiposPruebas[prueba.prueba.tipo] = 0;
            }
            tiposPruebas[prueba.prueba.tipo] += prueba.valor;
        }
        return tiposPruebas;
    }

    calcularDescuentosSisben(Sisben) {
        let totalDescuento = 0;
        for (let i = 0; i < this.pruebas_realizadas.length; i++) {
            const prueba = this.pruebas_realizadas[i];
            if (prueba.paciente.sisben === Sisben) {
                let descuento = prueba.valor * prueba.prueba.descuento_sisben[Sisben];
                totalDescuento += descuento;
            }
        }
        return totalDescuento;
    }

    obtenerPromedioIngresos() {
        let totalIngresos = this.calcularIngresosTotales();
        let promedio = totalIngresos / this.pruebas_realizadas.length;
        return promedio;
    }

    obtenerLaboratoriosPorEncimaPromedio() {
        let promedio = this.obtenerPromedioIngresos();
        let laboratoriosPorEncimaPromedio = [];
        for (let i = 0; i < this.pruebas_realizadas.length; i++) {
            const prueba = this.pruebas_realizadas[i];
            if (prueba.valor > promedio) {
                laboratoriosPorEncimaPromedio.push(prueba.paciente.nombre);
            }
        }
        return laboratoriosPorEncimaPromedio;
    }

    obtenerLaboratoriosPorDebajoPromedio() {
        let promedio = this.obtenerPromedioIngresos();
        let laboratoriosPorDebajoPromedio = [];
        for (let i = 0; i < this.pruebas_realizadas.length; i++) {
            const prueba = this.pruebas_realizadas[i];
            if (prueba.valor < promedio) {
                laboratoriosPorDebajoPromedio.push(prueba.paciente.nombre);
            }
        }
        return laboratoriosPorDebajoPromedio;
    }
}

class Paciente {
    constructor(nombre, edad, genero, sisben, salario) {
        this.nombre = nombre;
        this.edad = edad;
        this.genero = genero;
        this.sisben = sisben;
        this.salario = salario;
    }
}

class Prueba {
    constructor(nombre, valor, descuento_sisben, tipo) {
        this.nombre = nombre;
        this.valor = valor;
        this.descuento_sisben = descuento_sisben;
        this.tipo = tipo;
    }
}

// Ejemplo:
let laboratorio = new Laboratorio("Laboratorio ABC");

let prueba1 = new Prueba("Prueba de Sangre", 100, { A: 0.1, B1: 0.05, B2: 0.02 }, "Sangre");
let prueba2 = new Prueba("Prueba de ojos", 80, { A: 0.1, B1: 0.05, B2: 0.02 }, "Orina");

let paciente1 = new Paciente("Juancho",22,'m', "A",10000000);
let paciente2 = new Paciente("Mariana", 27, 'f',"B1", 2000000);
let paciente3 = new Paciente("Pepe", 90, "m","A",3000000);

laboratorio.agregarPaciente(paciente1);
laboratorio.agregarPaciente(paciente2);
laboratorio.agregarPaciente(paciente3);

laboratorio.realizarPrueba(paciente1, prueba1);
laboratorio.realizarPrueba(paciente2, prueba1);
laboratorio.realizarPrueba(paciente3, prueba2);

console.log("Ingresos totales:", laboratorio.calcularIngresosTotales());
console.log("Ingresos por regimen A:", laboratorio.calcularIngresosPorRegimen("A"));
console.log("Descuentos para nivel A:", laboratorio.calcularDescuentosSisben("A"));
console.log("Tipos de pruebas con ingresos:", laboratorio.obtenerTiposPruebasConIngresos());
console.log("Laboratorios por encima del promedio:", laboratorio.obtenerLaboratoriosPorEncimaPromedio());
console.log("Laboratorios por debajo del promedio:", laboratorio.obtenerLaboratoriosPorDebajoPromedio());
