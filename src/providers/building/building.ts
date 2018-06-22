import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the BuildingProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class BuildingProvider {

    constructor(public http: Http) {
        console.log('Hello BuildingProvider Provider');
    }

    public list() {
        return [
            {
                id: 1,
                name: 'Torre A',
                description: 'World Trade Center Bogota',
                floors: [
                    {
                        id: 1,
                        name: 'Piso 2'
                    },
                    {
                        id: 2,
                        name: 'Piso 3'
                    },
                    {
                        id: 3,
                        name: 'Piso 4'
                    },
                    {
                        id: 4,
                        name: 'Piso 5'
                    },
                    {
                        id: 5,
                        name: 'Piso 6'
                    },
                    {
                        id: 6,
                        name: 'Piso 7'
                    },
                    {
                        id: 7,
                        name: 'Piso 8'
                    },
                    {
                        id: 8,
                        name: 'Piso 9'
                    },
                    {
                        id: 9,
                        name: 'Piso 10'
                    },
                    {
                        id: 10,
                        name: 'Piso 11'
                    },
                    {
                        id: 11,
                        name: 'Administration'
                    },
                ]
            },
            {
                id: 2,
                name: 'Torre B',
                description: 'World Trade Center Bogota',
                floors: [
                    {
                        id: 1,
                        name: 'Club Atheneum'
                    },
                    {
                        id: 2,
                        name: 'Piso 5'
                    },
                    {
                        id: 3,
                        name: 'Piso 6'
                    },
                    {
                        id: 4,
                        name: 'Piso 7'
                    },
                    {
                        id: 5,
                        name: 'Piso 8'
                    },
                    {
                        id: 6,
                        name: 'Piso 9'
                    },
                    {
                        id: 7,
                        name: 'Piso 10'
                    },
                    {
                        id: 8,
                        name: 'Piso 11'
                    }
                ]
            },
            {
                id: 3,
                name: 'Torre C',
                description: 'World Trade Center Bogota',
                floors: [
                    {
                        id: 1,
                        name: 'Piso 2'
                    },
                    {
                        id: 2,
                        name: 'Piso 3'
                    },
                    {
                        id: 3,
                        name: 'Piso 4'
                    },
                    {
                        id: 4,
                        name: 'Piso 5'
                    },
                    {
                        id: 5,
                        name: 'Piso 6'
                    },
                    {
                        id: 6,
                        name: 'Piso 7'
                    },
                    {
                        id: 7,
                        name: 'Piso 8'
                    },
                    {
                        id: 8,
                        name: 'Piso 9'
                    },
                    {
                        id: 9,
                        name: 'Piso 10'
                    },
                    {
                        id: 10,
                        name: 'Piso 11'
                    },
                    {
                        id: 11,
                        name: 'Restaurante La Fragata'
                    },
                ]
            }
        ];
    }
}
