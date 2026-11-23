import { Component } from '@angular/core';

@Component({
  selector: 'app-home-tienda',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}


// Código React original conservado como referencia y totalmente comentado.
// Origen: componentes\zonaTienda\Home\Home.jsx
// import './Home.css'
//
// function Home(){
//     return (
//         <div className="d-flex flex-row justify-content-center align-items-center Home">
//             <h3>Pagina principal se carga dentro del layout cuando en url aparece "/"</h3>
//             <p>aqui mostrariamos las Ofertas de la semana, productos mas destacados, etc...</p>
//         </div>
//     )
// }
//
// export default Home
