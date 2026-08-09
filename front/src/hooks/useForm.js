import { useState, useCallback } from "react";

export function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const updateField = useCallback((field, value) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const updateFields = useCallback((patch) => {
        setValues((prev) => ({ ...prev, ...patch }));
        setErrors((prev) => {
            const next = { ...prev };
            Object.keys(patch).forEach((field) => delete next[field]);
            return next;
        });
    }, []);

    const setFieldError = useCallback((field, message) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const clearErrors = useCallback(() => setErrors({}), []);

    const validate = useCallback((schema) => {
        const newErrors = {};
        Object.entries(schema).forEach(([field, validator]) => {
            const message = validator(values[field], values);
            if (message) newErrors[field] = message;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    return {
        values,
        errors,
        updateField,
        updateFields,
        setFieldError,
        clearErrors,
        validate,
        reset,
        setValues,
    };
}