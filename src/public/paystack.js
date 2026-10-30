let sdkPromise;

function loadPaystack() {
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      const fail = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error('Paystack could not load. Try again or use the secure payment page below.'));
      };
      const timeout = setTimeout(fail, 20000);
      script.onload = () => {
        clearTimeout(timeout);
        resolve(window.PaystackPop);
      };
      script.onerror = fail;
      document.head.appendChild(script);
    }).catch((error) => {
      sdkPromise = undefined;
      throw error;
    });
  }
  return sdkPromise;
}

export async function openPaystackCheckout(accessCode, callbacks) {
  const Paystack = await loadPaystack();
  new Paystack().resumeTransaction(accessCode, callbacks);
}
