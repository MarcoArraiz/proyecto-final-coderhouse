import ItemCard from "../ItemCard/ItemCard";

// eslint-disable-next-line react/prop-types
const ItemList = ({ productos }) => {
    
    return (
        <div className="contenedorProductos container-fluid d-flex row row-cols-auto justify-content-around">
            {productos.map((prod) => (
                <ItemCard key={prod._id} {...prod} />
            ))}
        </div>
    );
};

export default ItemList;
