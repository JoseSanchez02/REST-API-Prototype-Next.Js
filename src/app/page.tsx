"use client";

import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import type { Item } from "@/lib/data";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreateItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setNewItem({ name: "", description: "" });
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to create item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const originalItems = [...items];
    setItems(items.filter(item => item.id !== id));
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setItems(originalItems); // Revert on failure
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      setItems(originalItems); // Revert on failure
    }
  };
  
  const handleUpdateItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingItem.name, description: editingItem.description }),
      });
      if (response.ok) {
        setEditingItem(null);
        await fetchItems();
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem(prev => (prev ? { ...prev, [name]: value } : null));
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold tracking-tight">RESTful Router</h1>
        <p className="text-muted-foreground mt-2">A simple interface to demonstrate CRUD operations with a Next.js API.</p>
      </header>
      
      <div className="grid gap-12 md:grid-cols-2">
        <section>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <PlusCircle className="h-6 w-6" />
                Create New Item
              </CardTitle>
              <CardDescription>Add a new resource to the server via a POST request.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateItem}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Item Name" value={newItem.name} onChange={handleNewItemChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Item Description" value={newItem.description} onChange={handleNewItemChange} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? 'Creating...' : 'Create Item'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>
        
        <section>
          <h2 className="font-headline text-2xl font-bold mb-4">Available Items (GET)</h2>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                     <Skeleton className="h-10 w-20" />
                     <Skeleton className="h-10 w-20" />
                  </CardFooter>
                </Card>
              ))
            ) : items.length > 0 ? (
              items.map(item => (
                <Card key={item.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit (PUT)
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">No items found. Create one to get started!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>

      <Dialog open={!!editingItem} onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Item</DialogTitle>
            <DialogDescription>
              Update the resource details. This will send a PUT request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateItem}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" value={editingItem?.name || ""} onChange={handleEditItemChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" name="description" value={editingItem?.description || ""} onChange={handleEditItemChange} required />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
