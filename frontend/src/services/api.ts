import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_BASE_URL;

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  user: {
    _id: string;
    name: string;
    company: string;
  };
  questions: {
    questionId: string | {
      _id: string;
      text: string;
    };
    answer: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  category: string;
  price: number;
  questions: {
    questionId: string;
    answer: string;
  }[];
}

export interface Question {
  _id: string;
  text: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options: string[];
  required: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  // Products
  getProducts: () => axios.get<Product[]>('/api/products'),
  getProduct: (id: string) => axios.get<Product>(`/api/products/${id}`),
  createProduct: (product: CreateProductInput) =>
    axios.post<Product>('/api/products', product),
  updateProduct: (id: string, product: Partial<Product>) =>
    axios.put<Product>(`/api/products/${id}`, product),
  deleteProduct: (id: string) => axios.delete(`/api/products/${id}`),

  // Questions
  getQuestions: () => axios.get<Question[]>('/api/questions'),
  getQuestion: (id: string) => axios.get<Question>(`/api/questions/${id}`),
  createQuestion: (question: Omit<Question, '_id' | 'createdAt' | 'updatedAt'>) =>
    axios.post<Question>('/api/questions', question),
  updateQuestion: (id: string, question: Partial<Question>) =>
    axios.put<Question>(`/api/questions/${id}`, question),
  deleteQuestion: (id: string) => axios.delete(`/api/questions/${id}`),

  // Reports
  generateReport: (productId: string) => axios.post(`/api/reports/generate/${productId}`, {}, { responseType: 'blob' }),
  getReports: () => axios.get('/api/reports'),
};

export default api;
