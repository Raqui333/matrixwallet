const API_URL = 'http://localhost:8080';

function toClipboard(string) {
  navigator.clipboard.writeText(string);
}

async function generateAddress() {
  const response = await fetch(API_URL + '/createWallet', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  document.getElementById('ibskx').innerHTML = `
    <span class='.toclipboard'>${data.your_address}</span>
    </br></br>
    <span class='.toclipboard'>${data.your_key}</span>
    </br></br>
    <span>[CLICK TO COPY]</span>
  `;

  Array.from(document.getElementsByClassName('.toclipboard')).forEach(
    (elem) => {
      elem.addEventListener(
        'mouseover',
        () => (elem.style.textDecoration = 'underline')
      );

      elem.addEventListener(
        'mouseout',
        () => (elem.style.textDecoration = 'none')
      );

      elem.addEventListener('click', () => toClipboard(elem.innerText));
    }
  );
}

async function login() {
  const address = document.getElementById('i5j5x').value;
  const private_key = document.getElementById('ib6sj').value;

  const response = await fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      public_key: address,
      private_key: private_key,
    }),
  });

  if (response.status !== 200) {
    document.getElementById('ibskx').innerHTML = `
      <span style='color:#ff0000'>Wrong login, try again</span>
    `;
    return -1;
  }

  sessionStorage.setItem('address', address);
  sessionStorage.setItem('key', private_key);

  window.location.href = 'home.html';
}

window.addEventListener('DOMContentLoaded', (_event) => {
  document.getElementById('igqpr').onclick = generateAddress;
  document.getElementById('ibxbk').onclick = login;
});
