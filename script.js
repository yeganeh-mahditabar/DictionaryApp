const wordInput = document.querySelector('.search-form input');
const wordDetails = document.querySelector('.dictionary-content');
const searchForm = document.querySelector('.search-form');
const definitionContainer = document.querySelector('.dictionary-definition-container');
const definitionTemplate = document.querySelector('.dictionary-definition-template');
const errorElement = document.querySelector('.errors');
const phoneticIcon = document.querySelector('.item-icon img');
const phoneticContent = document.querySelector('.item-content');

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const word = urlParams.get('word');
    if (word) {
        wordInput.value = word;
        fetchWordData(word);
    }
});

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const word = wordInput.value.trim();

    if (word) {
        await fetchWordData(word);
        updateURL(word);
    } else {
        errorElement.textContent = "Please enter the word correctly.";
        errorElement.classList.add('show-error');
        wordDetails.setAttribute('hidden', '');
        definitionContainer.innerHTML = '';
        phoneticIcon.hidden = true;
        phoneticContent.hidden = true;
    }
});

async function fetchWordData(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        
        errorElement.textContent = '';
        errorElement.classList.remove('show-error');
        displayWordData(data);
    } catch (error) {
        errorElement.textContent = "Please enter the word correctly.";
        errorElement.classList.add('show-error');
        wordDetails.setAttribute('hidden', '');
        definitionContainer.innerHTML = '';
        phoneticIcon.hidden = true;
        phoneticContent.hidden = true;
    }
}

function displayWordData(data) {
    errorElement.textContent = '';
    errorElement.classList.remove('show-error');

    wordDetails.removeAttribute('hidden');
    phoneticIcon.removeAttribute('hidden');
    phoneticContent.removeAttribute('hidden');

    const phoneticParagraph = document.querySelector('.phonetic');
    phoneticParagraph.textContent = data[0].phonetics[0]?.text || 'No phonetic data';
    
    definitionContainer.innerHTML = '';

    data[0].meanings.forEach(meaning => {
        const definition = definitionTemplate.cloneNode(true);
        definition.hidden = false;
        
        const partOfSpeechHeading = definition.querySelector('h3');
        const definitionParagraph = definition.querySelector('p');

        partOfSpeechHeading.textContent = meaning.partOfSpeech;
        definitionParagraph.textContent = meaning.definitions[0]?.definition || 'No definition available';

        definitionContainer.appendChild(definition);
    });
}

function updateURL(word) {
    const newURL = `${window.location.origin}${window.location.pathname}?word=${encodeURIComponent(word)}`;
    window.history.pushState({ path: newURL }, '', newURL);
}
