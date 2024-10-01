import { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { FilePenLine,Trash2,Ellipsis  } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: "Grocery Store App" },
    { name: "description", content: "Manage your grocery items!" },
  ];
};


interface GroceryItemProps {
  id: number;
  name: string;
  amount: number;
  note: string;
  status: string;
}


export default function Index() {
  const [groceryItem, setGroceryItem] = useState<GroceryItemProps>({
    id: Date.now(),
    name: "",
    amount: 0,
    note: "",
    status: "pending",
  });
  
  const [groceryList, setGroceryList] = useState<GroceryItemProps[]>([]);
  const [isEditing, setIsEditing] = useState(false); 
  const [editId, setEditId] = useState<number | null>(null); 


  useEffect(() => {
    const storedGroceryList = JSON.parse(localStorage.getItem("groceryList") || "[]");
    setGroceryList(storedGroceryList);
  }, []);

  
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGroceryItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleNewEntry = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing && editId !== null) {
    
      const updatedList = groceryList.map((item) =>
        item.id === editId ? { ...groceryItem, id: editId } : item
      );
      setGroceryList(updatedList);
      localStorage.setItem("groceryList", JSON.stringify(updatedList));

     
      setIsEditing(false);
      setEditId(null);
    } else {
      
      const updatedList = [...groceryList, { ...groceryItem, id: Date.now() }];
      setGroceryList(updatedList);
      localStorage.setItem("groceryList", JSON.stringify(updatedList));
    }


    setGroceryItem({
      id: Date.now(),
      name: "",
      amount: 0,
      note: "",
      status: "pending",
    });
  };

 
  const handleDelete = (id: number) => {
    const updatedList = groceryList.filter((item) => item.id !== id);
    setGroceryList(updatedList);
    localStorage.setItem("groceryList", JSON.stringify(updatedList));
  };

  
  const handleEdit = (id: number) => {
    const itemToEdit = groceryList.find((item) => item.id === id);
    if (itemToEdit) {
      setGroceryItem(itemToEdit);
      setIsEditing(true);
      setEditId(id);
    }
  };

  
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-16 w-full">
        <h1 className="leading w-full text-center text-2xl font-bold text-white px-5 py-2 bg-blue-600 dark:text-gray-100">
          Welcome to Grocery Store
        </h1>
      </div>

    
      <div className="p-5">
        <div className=" text-3xl font-bold text-blue-600">
          {isEditing ? "Edit grocery item" : "Enter new grocery item"}
        </div>
        <Form onSubmit={handleNewEntry} className="w-full flex gap-4 flex-col items-center">
          <div className="flex gap-5 w-full">
            <div className=" w-full">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleOnChange}
                value={groceryItem.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className=" w-full">
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                onChange={handleOnChange}
                value={groceryItem.amount}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div className="flex gap-5 w-full">
            <div className="mb-5 w-full">
              <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Note
              </label>
              <textarea
                rows={1}
                id="note"
                name="note"
                onChange={handleOnChange}
                value={groceryItem.note}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="mb-5 w-full">
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <select
                name="status"
                id="status"
                onChange={handleOnChange}
                value={groceryItem.status}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="pending">Pending</option>
                <option value="purchased">Purchased</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">
              {isEditing ? "Save Changes" : "Submit"}
            </button>
          </div>
        </Form>
      </div>

     
      <div className="p-5">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h2 className="w-full text-4xl font-bold">Grocery List</h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">#Id</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Edit</th>
                <th className="px-6 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {groceryList.length > 0 ? (
                groceryList.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.id}
                    </th>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.amount}</td>
                    <td className="px-6 py-4">{item.note}</td>
                    <td className="px-6 py-4">{item.status}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(item.id)} className="font-medium text-blue-600 hover:text-blue-800">
                        <FilePenLine />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(item.id)} className="font-medium text-red-600 hover:hover:text-red-800">
                      <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No items in the grocery list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
