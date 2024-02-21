function generarId(products){
    let id=0;
    if (products.length === 0){
        id=1;
    } else {
        id=products[products.length-1].id+1;
    }
    return id;
}

class ProductManager{
    constructor(){
        this.products = [];
    }
    addProduct(title,description,price,thumbnail,code,stock){
        if (this.products.some(product => product.code === code)) {
            console.error("Error: El código ya existe para otro producto.");
            return;
        }        
        const product = {
            id: generarId(this.products),
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
        }
        this.products.push(product);
    }
    getProducts(){
        return this.products;
    }
    getProductById(productID, products){
        const product = products.find(product => product.id === productID);
        if (!product) {
            console.log("Not found");
        } else {
            console.log("Product found:", product);
        }
    }    
}

// Ejemplo de uso
const manager = new ProductManager();
manager.addProduct("Product1", "Description Product1", 5.7, "imgproduct1.jpg", "P1", 2);
manager.addProduct("Product2", "Description Product2", 10.2, "imgproduct2.jpg", "P2", 3);

console.log(manager.getProducts());


manager.getProductById(1, manager.getProducts());
manager.getProductById(3, manager.getProducts());