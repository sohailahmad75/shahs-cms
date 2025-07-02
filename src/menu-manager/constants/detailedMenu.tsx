interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  type: string;
  dietaryInfo: string[];
  stock: number;
  isAvailable: boolean;
  tags: string[];
}

interface Category {
  name: string;
  items: MenuItem[];
}
export const DETAILED_MENU: Category[] = [
  {
    name: "Platters",
    items: [
      {
        id: "62f66c09-dc2e-44ec-82a4-37c9d7cdada8",
        name: "Chicken Over Rice",
        description:
          "Grilled marinated chicken served over fragrant basmati rice with fresh salad and a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/b6db5310-5cdb-4884-9a75-139272413679/image.jpeg",
        category: "Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: ["popular"],
      },
      {
        id: "280a41be-678a-4e57-aac9-1b336787b331",
        name: "Combo Over Rice",
        description:
          "Grilled chicken and lamb served over aromatic rice with salad and a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/d89a9df1-34af-4989-899c-ef950443e59e/image.jpeg",
        category: "Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "fabfd7f3-defa-4282-b1cc-7e6543a39c39",
        name: "Lamb Over Rice",
        description:
          "Seasoned ground lamb grilled to perfection, served over basmati rice with salad and a drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/2a3e9861-1391-4046-99e2-44ba45c8f4a9/image.jpeg",
        category: "Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "0a763b08-4566-400f-abc8-c1eca2179190",
        name: "Falafel Over Rice",
        description:
          "Crispy falafel served over rice and salad with a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/fd3a0d1f-c549-42dd-b6d6-eb62d1161cba/image.jpeg",
        category: "Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "e46a1fa4-73a1-46a8-ab44-07dbeaedbcff",
        name: "Kofta over Rice",
        description:
          "Chicken kofta skewers chopped over rice and salad with a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/67496b82-13a0-4975-9e6c-b6207786becc/image.jpeg",
        category: "Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
    ],
  },
  {
    name: "Salads",
    items: [
      {
        id: "90ad8e76-3201-4e10-8e27-f6902c3b9d01",
        name: "Chicken Over Salad",
        description:
          "Grilled chicken served over fresh salad with sauces and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/b6db5310-5cdb-4884-9a75-139272413679/image.jpeg",
        category: "Salads",
        type: "Salad",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "2212bd90-c004-4c66-964b-0ed48c43dbfc",
        name: "Combo Over Salad",
        description:
          "Chicken and lamb mix over salad with sauces and a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/d89a9df1-34af-4989-899c-ef950443e59e/image.jpeg",
        category: "Salads",
        type: "Salad",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "6359a92d-7f67-41f0-94ef-b46eaf6e0ce3",
        name: "Lamb Over Salad",
        description:
          "Ground lamb over salad with sauces and a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/2a3e9861-1391-4046-99e2-44ba45c8f4a9/image.jpeg",
        category: "Salads",
        type: "Salad",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "6c263ff2-ecae-4392-89f3-bb5e38e98d64",
        name: "Falafel Over Salad",
        description:
          "Crispy falafel served over fresh salad with sauces and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/fd3a0d1f-c549-42dd-b6d6-eb62d1161cba/image.jpeg",
        category: "Salads",
        type: "Salad",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "01dfc1fd-1997-4e7a-a6f4-9f1956b42808",
        name: "Kofta over Salad",
        description:
          "Grilled chicken kofta over salad with your choice of sauces.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/67496b82-13a0-4975-9e6c-b6207786becc/image.jpeg",
        category: "Salads",
        type: "Salad",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
    ],
  },
  {
    name: "Gyros",
    items: [
      {
        id: "c56e581b-79d2-409b-a83d-70d6c5ea11e1",
        name: "Chicken Gyro",
        description:
          "Grilled chicken over pita with salad, sauce, and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/b7fbc6df-4e08-406c-ad97-4294fbb2014d/image.jpeg",
        category: "Gyros",
        type: "Gyro",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "9f11d3c7-8f2f-4cbf-aaa9-66f4e23e6b25",
        name: "Combo Gyro",
        description:
          "Chicken and lamb mix on pita with salad, sauce, and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/e7fe0713-5101-4482-9432-c5cdb2fcdee4/image.jpeg",
        category: "Gyros",
        type: "Gyro",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "b7db0ad3-2259-466f-86e7-8f1b8f2e527f",
        name: "Falafel Gyro",
        description:
          "Falafel served on pita with salad, sauces, and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/759e30f6-cc6d-4d6e-a900-f6ce3595e4f2/image.jpeg",
        category: "Gyros",
        type: "Gyro",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "4b0b9019-0c11-42aa-9186-4d6eb4450a34",
        name: "Lamb Gyro",
        description:
          "Ground lamb on pita with salad, sauces, and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/0cc22fb5-cbf9-46a7-800b-1bbd0f6b9da4/image.jpeg",
        category: "Gyros",
        type: "Gyro",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "678bf2c9-3c2f-4263-8893-f6017e2c7a65",
        name: "Kofta Gyro",
        description: "Chopped chicken kofta on pita with salad and sauce.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/15efbefb-358b-4c21-88c5-25dbab4811c0/image.jpeg",
        category: "Gyros",
        type: "Gyro",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
    ],
  },
  {
    name: "Chips Platters",
    items: [
      {
        id: "eb45331a-21d0-4a3f-baad-b87227edcf31",
        name: "Chicken Over Chips",
        description: "Grilled chicken over chips and salad with a free drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/58dc02c2-6829-41bc-a741-205cb4233302/image.jpeg",
        category: "Chips Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "db83922f-7bc9-47e3-b82c-60a512d68b7c",
        name: "Combo Over Chips",
        description: "Chicken and lamb over chips and salad with a drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/34da0087-53f6-4804-b434-a4b5978159ee/image.jpeg",
        category: "Chips Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "a2b84c3d-23fc-40b4-9670-c1f5ec5e0d80",
        name: "Lamb Over Chips",
        description:
          "Grilled lamb over chips and salad with a free canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/32cfd164-7b15-4ad7-a713-7926fec6d464/image.jpeg",
        category: "Chips Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "107e13ce-2d41-4e56-a98d-340c96788b2c",
        name: "Fish over Chips",
        description:
          "Swai fillet in crispy batter served with chips and salad.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/523705c2-d325-4fb4-9099-57430b435fb3/image.jpeg",
        category: "Chips Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: ["Fish"],
      },
      {
        id: "6f1240eb-2d91-4f6a-b07d-e29c87d5df83",
        name: "Falafel Over Chips",
        description: "Crispy falafel with chips, salad, and a canned drink.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/6e043406-123a-4163-b037-371c02589d56/image.jpeg",
        category: "Chips Platters",
        type: "Platter",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
      {
        id: "c77fdb2f-08b7-4cb0-9170-92b51f4cb22a",
        name: "Kofta over Chips",
        description: "Chopped chicken kofta over chips and salad.",
        price: "£9.99",
        image:
          "https://rs-menus-api.roocdn.com/images/6e043406-123a-4163-b037-371c02589d56/image.jpeg",
        category: "Chips Platters",
        type: "Platter",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: [],
      },
    ],
  },
  {
    name: "Sandwiches",
    items: [
      {
        id: "e3716573-a42f-4cb5-bb45-75cd86196f10",
        name: "Chicken Burger",
        description: "Grilled chicken steak with peppers, onions, and cheese.",
        price: "£4.99",
        image:
          "https://rs-menus-api.roocdn.com/images/11223e5b-d47a-40d4-9672-95da29332d4f/image.jpeg",
        category: "Sandwiches",
        type: "Sandwich",
        dietaryInfo: ["Halal"],
        stock: 40,
        isAvailable: true,
        tags: ["Burger", "Grilled"],
      },
      {
        id: "4c223934-2f18-4ef2-b155-214a0c7251c0",
        name: "Philli Cheese Steak",
        description:
          "Beef steak with onions, peppers, and cheese in a sandwich.",
        price: "£10.49",
        image:
          "https://rs-menus-api.roocdn.com/images/00d1e961-1695-4078-a871-91f0d1c860db/image.jpeg",
        category: "Sandwiches",
        type: "Sandwich",
        dietaryInfo: ["Halal"],
        stock: 35,
        isAvailable: true,
        tags: ["Beef", "Cheese"],
      },
      {
        id: "7698f7ac-c391-4a4d-96d2-1e979ecdc70f",
        name: "Beef Burger",
        description: "Grilled beef patty with melted American cheese.",
        price: "£4.99",
        image:
          "https://rs-menus-api.roocdn.com/images/f772410c-5d36-4e6d-a798-689253bf6eaf/image.jpeg",
        category: "Sandwiches",
        type: "Burger",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: ["Beef", "Burger"],
      },
    ],
  },
  {
    name: "Side Orders",
    items: [
      {
        id: "96f14a2e-64c1-4e93-b194-10f4cd8c96c1",
        name: "Chips",
        description: "You can get fresh just chips portion.",
        price: "£4.00",
        image:
          "https://rs-menus-api.roocdn.com/images/cd621e7b-7d6b-4db1-ac35-8298a2100e8d/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Side Orders",
        type: "Side",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 100,
        isAvailable: true,
        tags: ["Fries", "Vegan Friendly"],
      },
      {
        id: "82a746be-4d64-4bc4-90b7-d34d81c1ec43",
        name: "Hot Wings - 5 Pcs",
        description: "Spicy hot wings cooked to perfection.",
        price: "£4.49",
        image:
          "https://rs-menus-api.roocdn.com/images/412aebbb-e33b-4f7e-a46e-da252d839690/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Side Orders",
        type: "Side",
        dietaryInfo: ["Halal"],
        stock: 50,
        isAvailable: true,
        tags: ["Chicken", "Spicy"],
      },
      {
        id: "b6f77652-2c17-47c0-a3f0-86702e1ed1cc",
        name: "Chicken Nuggets - 8 Pcs",
        description: "8 pieces of crispy chicken nuggets.",
        price: "£5.99",
        image:
          "https://rs-menus-api.roocdn.com/images/5319021e-281e-49f5-8af9-4c2a39e4ea3e/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Side Orders",
        type: "Side",
        dietaryInfo: ["Halal"],
        stock: 60,
        isAvailable: true,
        tags: ["Chicken", "Snack"],
      },
      {
        id: "cc3a0f9b-d0cf-4e5e-9f3e-1312a05be1bb",
        name: "Chicken Nuggets (4) + Chips",
        description: "4 nuggets served with chips.",
        price: "£5.98",
        image:
          "https://rs-menus-api.roocdn.com/images/131ea972-e45d-40d7-91b0-b1e85bd6d074/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Side Orders",
        type: "Combo",
        dietaryInfo: ["Halal"],
        stock: 45,
        isAvailable: true,
        tags: ["Combo", "Chicken", "Fries"],
      },
      {
        id: "5a405e3e-e4c2-4fa5-9281-1e3e1de84bde",
        name: "Pita Bread",
        description: "Fresh warm pita bread.",
        price: "£1.50",
        image:
          "https://rs-menus-api.roocdn.com/images/c562ccbf-7ded-4050-9083-9a58a0ddcfa6/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Side Orders",
        type: "Bread",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 80,
        isAvailable: true,
        tags: ["Bread", "Wrap"],
      },
    ],
  },
  {
    name: "Drinks",
    items: [
      {
        id: "1",
        name: "Classic Ice Cola",
        description: "330ml classic fizzy cola drink.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/9f0c6d4c-fcb3-4266-bb4c-90e42a201a88/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 200,
        isAvailable: true,
        tags: ["Soft Drink", "Cold"],
      },
      {
        id: "2",
        name: "Strawberry Ice Drink",
        description: "330ml sweet strawberry flavoured drink.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/051ceffd-f0d9-4e37-a3cb-270112644aa9/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 180,
        isAvailable: true,
        tags: ["Fruit", "Cold"],
      },
      {
        id: "3",
        name: "Mango Ice Drink",
        description: "330ml mango-flavored refreshing drink.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/9091fa7f-b5c3-427b-827f-a84feac606fa/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 160,
        isAvailable: true,
        tags: ["Fruit", "Cold"],
      },
      {
        id: "4",
        name: "Lemon Ice Drink",
        description: "330ml lemon-flavored fizzy refreshment.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/acef0067-20e3-4c87-a12a-51256c0e6d68/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 150,
        isAvailable: true,
        tags: ["Citrus", "Cold"],
      },
      {
        id: "5",
        name: "Orange Ice",
        description: "330ml orange-flavored soft drink.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/42ff98ac-1d80-464d-b0b5-69e5bd8bfcab/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 140,
        isAvailable: true,
        tags: ["Fruit", "Cold"],
      },
      {
        id: "6",
        name: "Ice Pro X Cola (Diet)",
        description: "330ml diet cola drink.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/1f4475d4-f0d3-4475-81cd-175c429ff6ae/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan", "Sugar-Free"],
        stock: 170,
        isAvailable: true,
        tags: ["Diet", "Soft Drink"],
      },
      {
        id: "7",
        name: "Water",
        description: "Bottled water.",
        price: "£1.49",
        image:
          "https://rs-menus-api.roocdn.com/images/53d768f4-8ad1-45e4-bdfc-cc1d4911c56c/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Drinks",
        type: "Drink",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 300,
        isAvailable: true,
        tags: ["Water", "Hydration"],
      },
    ],
  },
  {
    name: "Sauce",
    items: [
      {
        id: "s1",
        name: "White Sauce",
        description: "Creamy white sauce, ideal for wraps or rice platters.",
        price: "£0.50",
        image:
          "https://rs-menus-api.roocdn.com/images/8d3f5f64-4718-4d79-bdaa-4ae84d7dcda8/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Sauce",
        type: "Condiment",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 999,
        isAvailable: true,
        tags: ["Creamy", "Cold"],
      },
      {
        id: "s2",
        name: "Hot Sauce",
        description: "Spicy red hot sauce to bring heat to any dish.",
        price: "£0.50",
        image:
          "https://rs-menus-api.roocdn.com/images/84169a75-78f3-492d-8f7d-8ddae27d5306/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Sauce",
        type: "Condiment",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 999,
        isAvailable: true,
        tags: ["Spicy", "Red"],
      },
      {
        id: "s3",
        name: "Green Chilli Chutney",
        description: "Tangy and spicy green chilli chutney.",
        price: "£0.50",
        image:
          "https://rs-menus-api.roocdn.com/images/4f1ae3fa-ae61-4961-90f3-7fddf982f5d5/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Sauce",
        type: "Condiment",
        dietaryInfo: ["Halal", "Vegan"],
        stock: 999,
        isAvailable: true,
        tags: ["Chutney", "Spicy", "Green"],
      },
      {
        id: "s4",
        name: "BBQ Sauce",
        description: "Smoky BBQ sauce with sweet and tangy notes.",
        price: "£0.50",
        image:
          "https://rs-menus-api.roocdn.com/images/635540ff-359f-4b99-a8f1-2ef682f85641/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Sauce",
        type: "Condiment",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 999,
        isAvailable: true,
        tags: ["BBQ", "Smoky", "Sweet"],
      },
    ],
  },
  {
    name: "Desserts",
    items: [
      {
        id: "d1",
        name: "Nutella Biscoff Mochi",
        description: "Soft mochi filled with Nutella and Biscoff cream.",
        price: "£2.99",
        image:
          "https://rs-menus-api.roocdn.com/images/8e37168c-9b8c-4a54-8cfc-89ef70547081/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Desserts",
        type: "Mochi",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 100,
        isAvailable: true,
        tags: ["Nutella", "Biscoff", "Sweet"],
      },
      {
        id: "d2",
        name: "Strawberry Mochi",
        description: "Delicate mochi with a creamy strawberry center.",
        price: "£2.99",
        image:
          "https://rs-menus-api.roocdn.com/images/c9b766fc-3c2b-42f4-a716-c13de6e2a2b7/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Desserts",
        type: "Mochi",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 100,
        isAvailable: true,
        tags: ["Strawberry", "Fruity"],
      },
      {
        id: "d3",
        name: "Vanilla Cheesecake Mochi",
        description: "Mochi with smooth vanilla cheesecake filling.",
        price: "£2.99",
        image:
          "https://rs-menus-api.roocdn.com/images/e9dae732-ca81-4ca7-981d-3ba77eb74336/image.jpeg?width=148.5&height=148.5&auto=webp&format=jpg&fit=crop",
        category: "Desserts",
        type: "Mochi",
        dietaryInfo: ["Halal", "Vegetarian"],
        stock: 100,
        isAvailable: true,
        tags: ["Cheesecake", "Vanilla", "Sweet"],
      },
    ],
  },
];
