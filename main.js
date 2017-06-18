document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const Element = {
    ciphertext: document.getElementById('ciphertext'),
    freqs: document.getElementById('freqs'),
    mapping: document.getElementById('mapping'),
    plaintext: document.getElementById('plaintext'),
    toggleFreqs: document.getElementById('toggle-freqs'),
  };

  let ciphertext = '';
  let mapping = new Map();
  let showFreqs = !Element.freqs.classList.contains('hidden');

  function updateCiphertext() {
    ciphertext = Element.ciphertext.value;
    updateFreqs();
    decrypt();
  }

  function toggleFreqs() {
    showFreqs = !showFreqs;
    if (showFreqs) {
      Element.freqs.classList.remove('hidden');
      updateFreqs();
    } else {
      Element.freqs.classList.add('hidden');
    }
  }

  function updateFreqs() {
    if (showFreqs) {
      const chars = ciphertext.toUpperCase().replace(/[^A-Za-z]/g, '');
      const freqMap =
          Array.prototype.reduce.call(chars, (map, chr) => {
            map[chr] = (map[chr] || 0) + 1;
            return map;
          }, {});
      const freqs =
          Object.entries(freqMap)
              .sort(([chrA, freqA], [chrB, freqB]) => freqB - freqA)
              .map(([chr, freq]) => chr + ':' + freq)
              .join(', ');
      Element.freqs.innerText = freqs;
    }
  }

  function updateMapping(event) {
    const key = event.srcElement.dataset.chr;
    const value = event.srcElement.value;
    if (value) {
      mapping.set(key, value);
    } else {
      mapping.delete(key);
    }
    decrypt();
  }

  function decrypt() {
    Element.plaintext.innerText = ciphertext.replace(/[A-Za-z]/g, (chr) => {
      const upperCase = (chr === chr.toUpperCase());
      const image = mapping.get(chr.toUpperCase());
      if (image) {
        return upperCase ? image.toUpperCase() : image.toLowerCase();
      } else {
        return chr;
      }
    });
  }

  function initMappingInputs() {
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    col1.classList.add('col');
    col2.classList.add('col');

    Array.prototype.forEach.call(ALPHABET, (chr, i) => {
      const chrEl = document.createElement('div');
      chrEl.innerText = chr + ' → ';
      const input = document.createElement('input');
      input.dataset.chr = chr;
      chrEl.appendChild(input);
      if (i < ALPHABET.length / 2) {
        col1.appendChild(chrEl);
      } else {
        col2.appendChild(chrEl);
      }
    });

    Element.mapping.appendChild(col1);
    Element.mapping.appendChild(col2);
  }

  initMappingInputs();
  updateCiphertext();
  Element.mapping.addEventListener('keyup', updateMapping);
  Element.ciphertext.addEventListener('keyup', updateCiphertext);
  Element.ciphertext.focus();
  Element.toggleFreqs.addEventListener('click', toggleFreqs);
}, {once: true});
