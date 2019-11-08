const { fromEvent, forkJoin, merge } = require('rxjs');
const { ajax } = require('rxjs/ajax');
const { tap, map, switchMap, reduce } = require('rxjs/operators');

let btn = document.getElementById('btn');
let res = document.getElementById('res')

sitio1 = {
    url: "http://localhost:3000/site1",
    nombre: "sitio1",
    getPrecio: () => ajax.getJSON(sitio1.url).pipe(
        map(data => { return { precio: data[0].precio, nombre: sitio1.nombre } })
    )

};
sitio2 = {
    url: "http://localhost:3000/site2",
    nombre: "sitio2",
    getPrecio: () => ajax.getJSON(sitio2.url).pipe(
        map(data => { return { precio: data.p, nombre: sitio2.nombre } })
    )

};
sitio3 = {
    url: "http://localhost:3000/site3",
    nombre: "sitio3",
    getPrecio: () => ajax.getJSON(sitio3.url).pipe(
        map(data => { return { precio: data.producto.valor, nombre: sitio3.nombre } })
    )

};

let coordinaYReduce$ = merge(sitio1.getPrecio(), sitio2.getPrecio(), sitio3.getPrecio())
    .pipe(
        reduce((acc, val) => {
            if (acc.precio < val.precio) {
                return acc;
            }
            return val
        }),
        map(s => '<h1>' + s.nombre + '</h1><br/><p>' + s.precio + '</p>')
    );

fromEvent(btn, 'click')
    .pipe(
        tap(x => res.innerHTML = ''),
        switchMap(

            ev => coordinaYReduce$

        )
    ).subscribe((resAct) => res.innerHTML = resAct);

/*let coordinaYreduceFork = forkJoin(sitio1.getPrecio(),sitio2.getPrecio(),sitio3.getPrecio())
         .pipe(
             map(([s1,s2,s3])=>{
                 let menor = s1;
                 if( s2.precio< menor.precio){
                     menor=s2;
                 }
                 if(s3.precio < menor.precio){
                     menor = s3;
                 }
                 return '<h1>' + s.nombre + '</h1><br/><p>' + s.precio + '</p>';
             })
         ) */
