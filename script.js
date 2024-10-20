const wordInput = document.querySelector('.search-form input');
const wordDetails = document.querySelector('.dictionary-content');
const searchForm = document.querySelector('.search-form');
const phoneticHeading = document.createElement('h2');
const phoneticParagraph = document.createElement('p');
const dictionaryItem = document.createElement('div');
const itemIcon = document.createElement('div');
const iconImage = document.createElement('img');
const itemContent = document.createElement('div');

dictionaryItem.classList.add('dictionary-item');
itemIcon.classList.add('item-icon');
iconImage.src = './image/dictio.png';
iconImage.alt = 'Phonetic Icon';
itemContent.classList.add('item-content');
phoneticHeading.textContent = 'Phonetic';

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
        wordDetails.innerHTML = '';
        const errorParagraph = document.createElement('p');
        errorParagraph.classList.add('error-message');
        errorParagraph.textContent = "Please enter the word correctly.";
        wordDetails.appendChild(errorParagraph);
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
        displayWordData(data);
    } catch (error) {
        wordDetails.innerHTML = '';
        const errorParagraph = document.createElement('p');
        errorParagraph.classList.add('error-message');
        errorParagraph.textContent = "Please enter the word correctly.";
        wordDetails.appendChild(errorParagraph);
    }
}

function displayWordData(data) {
    wordDetails.innerHTML = '';

    phoneticParagraph.textContent = data[0].phonetics[0]?.text || 'No phonetic data';
    
    itemIcon.appendChild(iconImage);
    itemContent.appendChild(phoneticHeading);
    itemContent.appendChild(phoneticParagraph);
    dictionaryItem.appendChild(itemIcon);
    dictionaryItem.appendChild(itemContent);
    wordDetails.appendChild(dictionaryItem);

    const definitionTemplate = document.createElement('div');
    definitionTemplate.classList.add('dictionary-definition');

    const partOfSpeechTemplate = document.createElement('h3');
    const definitionParagraphTemplate = document.createElement('p');

    data[0].meanings.forEach(meaning => {
        const definitionDiv = definitionTemplate.cloneNode();
        const partOfSpeechHeading = partOfSpeechTemplate.cloneNode();
        const definitionParagraph = definitionParagraphTemplate.cloneNode();

        partOfSpeechHeading.textContent = meaning.partOfSpeech;
        definitionParagraph.textContent = meaning.definitions[0]?.definition || 'No definition available';

        definitionDiv.appendChild(partOfSpeechHeading);
        definitionDiv.appendChild(definitionParagraph);
        wordDetails.appendChild(definitionDiv);
    });
}

function updateURL(word) {
    const newURL = `${window.location.origin}${window.location.pathname}?word=${encodeURIComponent(word)}`;
    window.history.pushState({ path: newURL }, '', newURL);
}