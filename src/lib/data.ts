export interface Item {
  id: string;
  name: string;
  description: string;
}

// In-memory data store
export let items: Item[] = [
  {
    id: "1",
    name: "Laptop",
    description: "A high-performance laptop for development.",
  },
  {
    id: "2",
    name: "Keyboard",
    description: "A mechanical keyboard with RGB lighting.",
  },
  {
    id: "3",
    name: "Monitor",
    description: "A 27-inch 4K monitor with high color accuracy.",
  },
];
