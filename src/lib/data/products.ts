export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 149.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-2V5C4p.png",
    category: "Footwear",
    description: "Premium comfort with responsive cushioning",
    stock: 45,
  },
  {
    id: 2,
    name: "MacBook Pro M2",
    price: 1299.99,
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229",
    category: "Electronics",
    description: "14-inch Retina display, 8GB RAM, 256GB SSD",
    stock: 15,
  },
  {
    id: 3,
    name: "Levi's 501 Original Jeans",
    price: 69.99,
    image:
      "https://levi.in/cdn/shop/files/798300241_03_Back1_9cccfdff-2abb-45b8-b8b9-8f77e678845a.jpg?v=1739622201&width=1445",
    category: "Clothing",
    description: "Classic straight fit denim jeans",
    stock: 100,
  },
  {
    id: 4,
    name: "Sony WH-1000XM4",
    price: 349.99,
    image: "https://m.media-amazon.com/images/I/510cs9VwjUL._AC_UF1000,1000_QL80_.jpg",
    category: "Electronics",
    description: "Wireless noise-canceling headphones",
    stock: 30,
  },
  {
    id: 5,
    name: "Casio G-Shock DW5600",
    price: 99.99,
    image:
      "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/D/DW/DW5/DW-5600BB-1/assets/DW-5600BB-1_Seq1.png.transform/main-visual-sp/image.png",
    category: "Accessories",
    description: "Digital sports watch with shock resistance",
    stock: 50,
  },
  {
    id: 6,
    name: "Nintendo Switch OLED",
    price: 349.99,
    image:
      "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_800/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-oled-model-white-set/gallery/image01",
    category: "Gaming",
    description: "Portable gaming console with enhanced display",
    stock: 25,
  },
  {
    id: 7,
    name: "Patagonia Better Sweater",
    price: 139.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9Tez-zpgDOBjUCnIA6upRGVgoDDgrZzPSvg&s",
    category: "Clothing",
    description: "Fleece jacket made from recycled materials",
    stock: 60,
  },
  {
    id: 8,
    name: "iPhone 15 Pro",
    price: 999.99,
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1692845702708",
    category: "Electronics",
    description: "256GB, Titanium finish, A17 Pro chip",
    stock: 20,
  },
  {
    id: 10,
    name: "PS5 DualSense Controller",
    price: 69.99,
    image:
      "https://img-prd-pim.poorvika.com/product/sony-ps5-dualsense-wireless-controller-gray-front-view.png",
    category: "Gaming",
    description: "Wireless gaming controller with haptic feedback",
    stock: 40,
  },
  {
    id: 11,
    name: "Ray-Ban Wayfarer",
    price: 159.99,
    image:
      "https://images.ray-ban.com/is/image/RayBan/805289126577__STD__shad__qt.png?impolicy=RB_Product&width=1024&bgc=%23f2f2f2",
    category: "Accessories",
    description: "Classic sunglasses with polarized lenses",
    stock: 35,
  },
  {
    id: 14,
    name: "Adidas Ultra Boost",
    price: 179.99,
    image:
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    category: "Footwear",
    description: "Running shoes with responsive cushioning",
    stock: 40,
  },
  {
    id: 15,
    name: "Apple AirPods Pro",
    price: 249.99,
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1200&hei=1200&fmt=jpeg&qlt=95&.v=1660803972361",
    category: "Electronics",
    description: "Wireless earbuds with active noise cancellation",
    stock: 30,
  },
  {
    id: 18,
    name: "Vans Old Skool",
    price: 69.99,
    image:
      "https://images-cdn.ubuy.co.in/64871de209c80568c61e1da4-vans-old-skool-men-racing-red-true.jpg",
    category: "Footwear",
    description: "Classic skateboarding shoes",
    stock: 70,
  },
  {
    id: 19,
    name: "Canon EOS R6",
    price: 2499.99,
    image: "https://static.bhphoto.com/images/images1000x1000/1594281159_1547010.jpg",
    category: "Electronics",
    description: "Full-frame mirrorless camera",
    stock: 10,
  },
  {
    id: 24,
    name: "Xbox Series X",
    price: 499.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRUW4v68Paf-jXYct3jhbqD4mJ5v9vZhsz6w&s",
    category: "Gaming",
    description: "Next-gen gaming console",
    stock: 15,
  },
  {
    id: 25,
    name: "Under Armour Shorts",
    price: 29.99,
    image:
      "https://underarmour.scene7.com/is/image/Underarmour/V5-1361433-001_FC?rp=standard-0pad|pdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=1200&hei=1200&size=1200,1200",
    category: "Clothing",
    description: "Athletic training shorts",
    stock: 90,
  },
];
