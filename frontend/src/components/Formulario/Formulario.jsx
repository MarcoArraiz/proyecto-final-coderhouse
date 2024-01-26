import { useState } from "react";
import { db } from "../../services/config";
import { doc, setDoc } from "firebase/firestore";


const Formulario = () => {
    const [nombre, setNombre] = useState("");
    const [documentoId, setDocumentoId] = useState(); 
    const [precio, setPrecio] = useState();
    const [idCat, setIdCat] = useState();
    const [stock, setStock] = useState();
    const [img, setImg] = useState();

    const manejadorFormulario = (e) => {
        e.preventDefault();

        setDoc(doc(db,"products",documentoId),{
            id: documentoId,
            nombre: nombre,
            precio: precio,
            idCat: idCat,
            stock: stock,
            img: img
        })

    }
    return (
        <>
            <form onSubmit={manejadorFormulario}>
                <h2> Formulario</h2>
                <div> 
                    <label htmlFor=""> Nombre</label>
                    <input type="text" value={nombre} onChange={(e)=> setNombre(e.target.value) } />
                </div>
                <div>
                    <label htmlFor=""> ID</label>
                    <input type="number" value={documentoId} onChange={(e)=> setDocumentoId(e.target.value) } />
                </div>
                <div> 
                    <label htmlFor=""> precio</label>
                    <input type="number" value={precio} onChange={(e)=> setPrecio(e.target.value) } />
                </div>
                <div>
                <label htmlFor=""> idCat</label>
                <input type="number" value={idCat} onChange={(e)=> setIdCat(e.target.value) } />
                </div>
                <div>
                <label htmlFor=""> stock</label>
                <input type="number" value={stock} onChange={(e)=> setStock(e.target.value) } />
                </div>
                <label htmlFor=""> IMAGEN</label>
                <input type="text" value={img} onChange={(e)=> setImg(e.target.value) } />
                <button type="submit"> enviar</button>
            </form>
        
        </>
    )
}

export default Formulario
