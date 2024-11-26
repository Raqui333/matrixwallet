const API_URL = 'http://localhost:8080';

const ADDRESS = sessionStorage.getItem('address');
const KEY = sessionStorage.getItem('key');

function resizeAddress() {
  document.getElementById('ima8i').style.width = `${window.innerWidth - 300}px`;
}

function getAddress() {
  const address_place = document.getElementById('ima8i');
  address_place.innerText = ADDRESS;
}

function matrixLog(string) {
  const logger = document.getElementById('idfo5');

  if (logger.innerHTML === 'No logs yet<br>') logger.innerHTML = '';

  logger.innerHTML += `
    <span>(${new Date().toISOString()}) ${string}</span><br/>
  `;
}

async function getBalance() {
  const response = await fetch(
    API_URL + '/getBalance/' + encodeURIComponent(ADDRESS)
  );
  const data = await response.json();
  document.getElementById('isgph').innerHTML = data.balance;
}

async function createTransaction(to, amount) {
  const request_body = {
    fromAddress: ADDRESS,
    toAddress: to,
    amount: amount,
  };

  const response = await fetch(API_URL + '/createTransaction', {
    method: 'POST',
    body: JSON.stringify(request_body),
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
}

async function signTransaction(transaction) {
  const response = await fetch(API_URL + '/sign', {
    method: 'POST',
    body: JSON.stringify({
      private_key: KEY,
      buffer: transaction.hash,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const { signature } = await response.json();

  return signature;
}

async function sendTransaction() {
  const toAddress = document.getElementById('iy9lx').value;
  const amount = Number(document.getElementById('iuntl').value);

  if (isNaN(amount) || amount <= 0) {
    document.getElementById('iuntl').value = null;
    document.getElementById('iuntl').placeholder = 'Enter a valid number';
    matrixLog('Please enter a valid number in [Amount] field.');
    return -1;
  }

  const transaction = await createTransaction(toAddress, amount);
  const signature = await signTransaction(transaction);

  const signed_transaction = {
    transaction: transaction,
    signature: signature,
  };

  const response = await fetch(API_URL + '/addTransaction', {
    method: 'POST',
    body: JSON.stringify(signed_transaction),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  matrixLog(data.message);
}

document.addEventListener('DOMContentLoaded', (_event) => {
  getAddress();
  resizeAddress();

  getBalance();
  setInterval(getBalance, 2000);
});

window.addEventListener('resize', resizeAddress);

function addressToClipboard() {
  navigator.clipboard.writeText(ADDRESS);
}
