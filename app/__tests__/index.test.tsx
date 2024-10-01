import { render, screen, fireEvent } from '@testing-library/react';
import Index from '../routes/_index';


// test code 
describe('Grocery Store App', () => {
  
  beforeEach(() => {
    
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => JSON.stringify([]));
    Storage.prototype.removeItem = jest.fn();
    
    render(<Index />);
  });

  test('renders the title', () => {
    const titleElement = screen.getByText(/Welcome to Grocery Store/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('adds a new grocery item', () => {
    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'Oranges' } });
    fireEvent.change(amountInput, { target: { value: '5' } });
    fireEvent.click(submitButton);

    const newItemElement = screen.getByText(/oranges/i);
    expect(newItemElement).toBeInTheDocument();
  });

  test('edits a grocery item', () => {
    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'Oranges' } });
    fireEvent.change(amountInput, { target: { value: '5' } });
    fireEvent.click(submitButton);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    fireEvent.change(amountInput, { target: { value: '10' } });
    fireEvent.click(submitButton);

    const updatedItemElement = screen.getByText(/10/i);
    expect(updatedItemElement).toBeInTheDocument();
  });

  test('deletes a grocery item', () => {
    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'Oranges' } });
    fireEvent.change(amountInput, { target: { value: '5' } });
    fireEvent.click(submitButton);

    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    const deletedItemElement = screen.queryByText(/oranges/i);
    expect(deletedItemElement).not.toBeInTheDocument();
  });

  test('shows no items message when grocery list is empty', () => {
    localStorage.clear();
    const noItemsMessage = screen.getByText(/no items in the grocery list/i);
    expect(noItemsMessage).toBeInTheDocument();
  });
});
