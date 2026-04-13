export default function ErrorMessage({ error, defaultMessage = null, message = null }) {
  // If defaultMessage is nul, the message does't change, the default will always show
  if (defaultMessage == null) {
    return error ? <p className="error_message">{message}</p> : null;
  }

  return error.invalid ? <p className="error_message">{error.message ?? defaultMessage}</p> : null;
}
