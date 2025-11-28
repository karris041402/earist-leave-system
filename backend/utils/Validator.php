<?php

class Validator {
    private $errors = [];

    /**
     * Validate data using given rules
     */
    public function validate($data, $rules) {
        foreach ($rules as $field => $ruleString) {
            $ruleList = explode('|', $ruleString);
            $value = $data[$field] ?? null;

            foreach ($ruleList as $rule) {
                $this->applyRule($field, $value, $rule, $data);
            }
        }

        return empty($this->errors);
    }

    /**
     * Apply each validation rule
     */
    private function applyRule($field, $value, $rule, $data) {
        // required
        if ($rule === 'required' && ($value === null || $value === '')) {
            return $this->addError($field, "$field is required");
        }

        // string
        if ($rule === 'string' && !is_string($value)) {
            return $this->addError($field, "$field must be a string");
        }

        // numeric
        if ($rule === 'numeric' && !is_numeric($value)) {
            return $this->addError($field, "$field must be numeric");
        }

        // email
        if ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return $this->addError($field, "Invalid email format");
        }

        // min:length
        if (strpos($rule, 'min:') === 0) {
            $min = (int) substr($rule, 4);
            if (strlen($value) < $min) {
                return $this->addError($field, "$field must be at least $min characters");
            }
        }

        // max:length
        if (strpos($rule, 'max:') === 0) {
            $max = (int) substr($rule, 4);
            if (strlen($value) > $max) {
                return $this->addError($field, "$field must not exceed $max characters");
            }
        }

        // min-value (numeric)
        if (strpos($rule, 'min_value:') === 0) {
            $min = (int) substr($rule, 11);
            if ($value < $min) {
                return $this->addError($field, "$field must be at least $min");
            }
        }

        // max-value (numeric)
        if (strpos($rule, 'max_value:') === 0) {
            $max = (int) substr($rule, 11);
            if ($value > $max) {
                return $this->addError($field, "$field must not exceed $max");
            }
        }

        // in: option1,option2
        if (strpos($rule, 'in:') === 0) {
            $allowed = explode(',', substr($rule, 3));
            if (!in_array($value, $allowed)) {
                return $this->addError($field, "$field must be one of: " . implode(', ', $allowed));
            }
        }

        // confirmed (password_confirmation)
        if ($rule === 'confirmed') {
            $confirmField = $field . '_confirmation';
            if (!isset($data[$confirmField]) || $data[$confirmField] !== $value) {
                return $this->addError($field, "$field confirmation does not match");
            }
        }

        // boolean
        if ($rule === 'boolean' && !in_array($value, [true, false, 0, 1, "0", "1"], true)) {
            return $this->addError($field, "$field must be a boolean");
        }

        // date
        if ($rule === 'date' && !$this->validateDate($value)) {
            return $this->addError($field, "$field must be a valid date (YYYY-MM-DD)");
        }
    }

    /**
     * Check if date is valid
     */
    private function validateDate($date) {
        if (!$date) return false;
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    /**
     * Store error
     */
    private function addError($field, $message) {
        $this->errors[$field][] = $message;
    }

    /**
     * Get all errors
     */
    public function getErrors() {
        return $this->errors;
    }
}
