"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  feedback: string;
  rating: string;
  languagelearned: string;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  rating: string;
  languagelearned: string;
}

const FeedbackForm = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    feedback: "",
    rating: "",
    languagelearned: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
    rating: "",
    languagelearned: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch("/api/csrf");
        const { csrfToken } = await res.json();
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMsg = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMsg = "Name can only contain letters and spaces.";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMsg = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = "Invalid email format.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMsg = "Phone number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          if (/\D/.test(value)) {
            errorMsg = "Invalid characters for a mobile number.";
          } else {
            errorMsg = "Phone number must be exactly 10 digits.";
          }
        }
        break;
      case "rating":
        if (!value) {
          errorMsg = "Rating is required.";
        } else if (!/^[1-5]$/.test(value)) {
          errorMsg = "Rating must be between 1 and 5.";
        }
        break;
      case "languagelearned":
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          errorMsg = "Languages can only contain letters and spaces.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    return errorMsg === "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const fieldNames = ["name", "email", "phone", "rating"] as const;
    let isValid = true;

    // Validate all required fields
    fieldNames.forEach((field) => {
      const isFieldValid = validateField(field, formData[field]);
      isValid = isValid && isFieldValid;
    });

    // Also validate languagelearned if it has a value
    if (formData.languagelearned) {
      const isFieldValid = validateField(
        "languagelearned",
        formData.languagelearned,
      );
      isValid = isValid && isFieldValid;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) {
      setSubmitMessage({
        text: "Please fix the errors before submitting.",
        isError: true,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("service", formData.service);
    formDataToSend.append("feedback", formData.feedback);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("languagelearned", formData.languagelearned);
    formDataToSend.append("csrfToken", csrfToken || "");

    if (file) {
      formDataToSend.append("file", file);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          text: result.message || "Feedback submitted successfully!",
          isError: false,
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          feedback: "",
          rating: "",
          languagelearned: "",
        });

        setFile(null); // Reset file input
      } else {
        setSubmitMessage({
          text: `Error: ${result.message || "Failed to submit feedback"}`,
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitMessage({
        text: "An error occurred while submitting feedback.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-slate-50 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-slate-700 text-white py-4 px-6">
          <h2 className="text-xl font-bold">Feedback Form</h2>
          <p className="text-slate-200">
            We value your feedback! Please fill out the form below.
          </p>
        </div>

        {submitMessage && (
          <div
            className={`p-4 ${submitMessage.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {submitMessage.text}
          </div>
        )}

        <form className="px-6 py-4" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? "border-red-500" : ""}`}
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-xs italic mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`}
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-xs italic mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? "border-red-500" : ""}`}
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-xs italic mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="service"
            >
              Service
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="service"
              name="service"
              type="text"
              placeholder="Service Availed"
              value={formData.service}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="feedback"
            >
              Feedback
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="feedback"
              name="feedback"
              placeholder="Your Feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rating"
            >
              Rating (1-5) <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.rating ? "border-red-500" : ""}`}
              id="rating"
              name="rating"
              type="number"
              placeholder="Rate us (1-5)"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
              aria-describedby={errors.rating ? "rating-error" : undefined}
            />
            {errors.rating && (
              <p id="rating-error" className="text-red-500 text-xs italic mt-1">
                {errors.rating}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="languagelearned"
            >
              Language(s) learned
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.languagelearned ? "border-red-500" : ""}`}
              id="languagelearned"
              name="languagelearned"
              type="text"
              placeholder="Languages (separate with spaces)"
              value={formData.languagelearned}
              onChange={handleChange}
              aria-describedby={
                errors.languagelearned ? "languagelearned-error" : undefined
              }
            />
            {errors.languagelearned && (
              <p
                id="languagelearned-error"
                className="text-red-500 text-xs italic mt-1"
              >
                {errors.languagelearned}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload File (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .pdf"
              className="shadow appearance-none border rounded w-full py-3 px-4"
            />
          </div>

          <input type="hidden" name="csrfToken" value={csrfToken || ""} />

          <div className="flex items-center justify-between">
            <Button
              variant="default"
              type="submit"
              disabled={!csrfToken || isSubmitting}
              className="bg-slate-700 hover:bg-slate-800 text-white py-2 px-4"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>

            <p className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
