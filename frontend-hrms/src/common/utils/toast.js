// WHEN USING IN OTHER PAGES

// IMPORT where toast will be used
// import { showToast } from "../../../common/utils/toast";

// CALL (add after success/button press)
// showToast.success("message")
// showToast.error("message")
// showToast.warning("message")
// showToast.info("message")

import { toast } from 'sonner'

// --------------------
// DEFAULT OPTIONS
// duration and placement of the toast
// --------------------
const defaultOptions = {
  duration: 3000,
  position: 'top-right',
}

// --------------------
// BASESTYLES 
// Design of all toasts (and toast types) throughout the application
// --------------------
const baseStyle = {
  borderRadius: '12px',
  fontSize: '14px',
  fontFamily: 'inherit',
}

// toast colors
const styles = {
  success: {
    ...baseStyle,
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#166534',
  },
  error: {
    ...baseStyle,
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
  },
  warning: {
    ...baseStyle,
    background: '#fffbeb',
    border: '1px solid #fcd34d',
    color: '#92400e',
  },
  info: {
    ...baseStyle,
    background: '#eff6ff',
    border: '1px solid #93c5fd',
    color: '#1e40af',
  },
}

export const showToast = {
  success: (msg, options = {}) =>
    toast.success(msg, {
      ...defaultOptions,
      ...options,
      style: {
        ...styles.success,
        ...options.style,
      },
    }),

  error: (msg, options = {}) =>
    toast.error(msg, {
      ...defaultOptions,
      ...options,
      style: {
        ...styles.error,
        ...options.style,
      },
    }),

  warning: (msg, options = {}) =>
    toast.warning(msg, {
      ...defaultOptions,
      ...options,
      style: {
        ...styles.warning,
        ...options.style,
      },
    }),

  info: (msg, options = {}) =>
    toast.info(msg, {
      ...defaultOptions,
      ...options,
      style: {
        ...styles.info,
        ...options.style,
      },
    }),
}