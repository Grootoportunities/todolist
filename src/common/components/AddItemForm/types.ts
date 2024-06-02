export type AddItemHelpers = {
  setError: (error: string) => void;
  setItemTitle: (title: string) => void;
};
export type AddItemFormProps = {
  addItem: (itemName: string, helpers: AddItemHelpers) => Promise<any>;
  disabled?: boolean;
};
