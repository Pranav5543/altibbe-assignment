import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api, Product, Question } from "../services/api";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    price: product?.price || 0,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
    if (product?.questions) {
      const initialAnswers: { [key: string]: string } = {};
      product.questions.forEach((q) => {
        if (q.questionId) {
          const questionId =
            typeof q.questionId === "string" ? q.questionId : q.questionId._id;
          initialAnswers[questionId] = q.answer;
        }
      });
      setAnswers(initialAnswers);
    }
  }, [product]);

  const fetchQuestions = async () => {
    try {
      const res = await api.getQuestions();
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions");
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (currentStep === 0) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.description)
        newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    } else {
      const currentQuestion = questions[currentStep - 1];
      if (
        currentQuestion &&
        currentQuestion.required &&
        !answers[currentQuestion._id]
      ) {
        newErrors[currentQuestion._id] = "This field is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      const productData: Partial<Product> = {
        ...formData,
        questions: questions.map((q) => ({
          questionId: q._id,
          answer: answers[q._id] || "",
        })),
      };
      onSubmit(productData);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base"
          placeholder="Enter product name"
          required
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base resize-none"
          rows={4}
          placeholder="Describe your product"
          required
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
            {errors.description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base"
            placeholder="Product category"
            required
          />
          {errors.category && (
            <p className="text-red-600 text-sm mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
              {errors.category}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
              {errors.price}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuestion = (question: Question) => {
    const answer = answers[question._id] || "";

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={answer}
            onChange={(e) =>
              setAnswers({ ...answers, [question._id]: e.target.value })
            }
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base"
            placeholder="Enter your answer"
            required={question.required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={answer}
            onChange={(e) =>
              setAnswers({ ...answers, [question._id]: e.target.value })
            }
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base"
            placeholder="Enter a number"
            required={question.required}
          />
        );
      case "boolean":
        return (
          <select
            value={answer}
            onChange={(e) =>
              setAnswers({ ...answers, [question._id]: e.target.value })
            }
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base bg-white"
            required={question.required}
          >
            <option value="">Select an option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case "select":
        return (
          <select
            value={answer}
            onChange={(e) =>
              setAnswers({ ...answers, [question._id]: e.target.value })
            }
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 transition-all duration-200 hover:border-gray-400 text-base bg-white"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  const totalSteps = questions.length + 1;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-product">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {product ? "Edit Product" : "Create New Product"}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {currentStep === 0 ? (
          renderBasicInfo()
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {questions[currentStep - 1]?.text}
              </h3>
              {renderQuestion(questions[currentStep - 1])}
              {errors[questions[currentStep - 1]?._id] && (
                <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                  {errors[questions[currentStep - 1]._id]}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 space-x-4">
          <button
            type="button"
            onClick={currentStep === 0 ? onCancel : handlePrev}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            aria-label={
              currentStep === 0 ? "Cancel form" : "Go to previous step"
            }
          >
            {currentStep === 0 ? "Cancel" : "Previous"}
          </button>
          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="button-press flex-1 px-6 py-3 bg-primary border border-transparent rounded-xl text-white font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl"
              aria-label="Go to next step"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="button-press flex-1 px-6 py-3 bg-primary border border-transparent rounded-xl text-white font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl"
              aria-label={product ? "Update product" : "Create product"}
            >
              {product ? "Update Product" : "Create Product"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
