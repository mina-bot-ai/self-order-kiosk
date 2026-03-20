const menuData = {
  categories: [
    {
      id: 'burgers',
      name: 'Burgers',
      icon: '🍔',
      items: [
        { id: 'b1', name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato, and our signature sauce', price: 5.99, image: 'https://placehold.co/400x300/ff6b35/ffffff?text=Classic+Burger', sizes: ['Regular', 'Large'], sizePrices: [0, 1.5] },
        { id: 'b2', name: 'Cheese Burger', description: 'Classic burger topped with melted American cheese', price: 6.99, image: 'https://placehold.co/400x300/ff6b35/ffffff?text=Cheese+Burger', sizes: ['Regular', 'Large'], sizePrices: [0, 1.5] },
        { id: 'b3', name: 'Bacon Burger', description: 'Topped with crispy bacon and smoky BBQ sauce', price: 7.99, image: 'https://placehold.co/400x300/ff6b35/ffffff?text=Bacon+Burger', sizes: ['Regular', 'Large'], sizePrices: [0, 1.5] },
        { id: 'b4', name: 'Veggie Burger', description: 'Plant-based patty with fresh garden vegetables', price: 6.49, image: 'https://placehold.co/400x300/4caf50/ffffff?text=Veggie+Burger', sizes: ['Regular', 'Large'], sizePrices: [0, 1.5] },
      ],
    },
    {
      id: 'sides',
      name: 'Sides',
      icon: '🍟',
      items: [
        { id: 's1', name: 'French Fries', description: 'Golden crispy fries seasoned to perfection', price: 2.99, image: 'https://placehold.co/400x300/ffc107/333333?text=French+Fries', sizes: ['Small', 'Medium', 'Large'], sizePrices: [0, 0.75, 1.25] },
        { id: 's2', name: 'Onion Rings', description: 'Crispy battered onion rings, golden and delicious', price: 3.49, image: 'https://placehold.co/400x300/ffc107/333333?text=Onion+Rings', sizes: ['Small', 'Medium', 'Large'], sizePrices: [0, 0.75, 1.25] },
        { id: 's3', name: 'Coleslaw', description: 'Fresh creamy coleslaw made daily', price: 1.99, image: 'https://placehold.co/400x300/8bc34a/ffffff?text=Coleslaw', sizes: ['Regular'], sizePrices: [0] },
      ],
    },
    {
      id: 'drinks',
      name: 'Drinks',
      icon: '🥤',
      items: [
        { id: 'd1', name: 'Cola', description: 'Ice-cold classic cola', price: 1.99, image: 'https://placehold.co/400x300/795548/ffffff?text=Cola', sizes: ['Small', 'Medium', 'Large'], sizePrices: [0, 0.5, 1.0] },
        { id: 'd2', name: 'Lemonade', description: 'Fresh-squeezed lemonade', price: 2.49, image: 'https://placehold.co/400x300/ffeb3b/333333?text=Lemonade', sizes: ['Small', 'Medium', 'Large'], sizePrices: [0, 0.5, 1.0] },
        { id: 'd3', name: 'Water', description: 'Chilled bottled water', price: 0.99, image: 'https://placehold.co/400x300/2196f3/ffffff?text=Water', sizes: ['Regular'], sizePrices: [0] },
        { id: 'd4', name: 'Milkshake', description: 'Thick creamy milkshake — Vanilla, Chocolate, or Strawberry', price: 3.99, image: 'https://placehold.co/400x300/f48fb1/ffffff?text=Milkshake', sizes: ['Regular', 'Large'], sizePrices: [0, 1.0] },
      ],
    },
    {
      id: 'desserts',
      name: 'Desserts',
      icon: '🍦',
      items: [
        { id: 'ds1', name: 'Ice Cream', description: 'Soft-serve vanilla ice cream in a cone or cup', price: 2.49, image: 'https://placehold.co/400x300/e1f5fe/333333?text=Ice+Cream', sizes: ['Regular', 'Large'], sizePrices: [0, 0.75] },
        { id: 'ds2', name: 'Apple Pie', description: 'Warm flaky apple pie slice', price: 1.99, image: 'https://placehold.co/400x300/ff7043/ffffff?text=Apple+Pie', sizes: ['Regular'], sizePrices: [0] },
        { id: 'ds3', name: 'Cookies', description: 'Freshly baked chocolate chip cookies (2 pack)', price: 1.49, image: 'https://placehold.co/400x300/a1887f/ffffff?text=Cookies', sizes: ['Regular'], sizePrices: [0] },
      ],
    },
  ],
};

export default menuData;
