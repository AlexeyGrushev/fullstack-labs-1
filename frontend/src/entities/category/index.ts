import { apiRequest } from "../../shared/lib/apiClient";

export type TransactionType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

export type CategoryInput = Omit<Category, "id">;

export function fetchCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}

export function createCategoryRequest(data: CategoryInput): Promise<Category> {
  return apiRequest<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCategoryRequest(id: number, data: CategoryInput): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCategoryRequest(id: number): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, { method: "DELETE" });
}
