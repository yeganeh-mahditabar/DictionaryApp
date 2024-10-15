const word = document.querySelector('.search-form input');
const wordDetails = document.querySelector('.dictionary-content');
const searchForm = document.querySelector('.search-form');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const word = document.querySelector('.search-form input').value.trim();

    if (word) {
        fetchWordData(word);
    } else {
        wordDetails.innerHTML = `<p style="color: #E57373;">"Please enter the word correctly."</p>`;
    }
});

function fetchWordData(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Word not found');
            }
            return response.json();
        })
        .then(data => displayWordData(data))
        .catch(error => {
            wordDetails.innerHTML = `<p style="color: #E57373;">"Please enter the word correctly."</p>`;
        });
}

function displayWordData(data) {

    wordDetails.innerHTML = `
        <div class="dictionary-item">
            <div class="item-icon">
                <img src="./image/dictio.png" alt="Phonetic Icon">
            </div>
            <div class="item-content">
                <h2>Phonetic</h2>
                <p>${data[0].phonetics[0].text || 'No phonetic data'}</p>
            </div>
        </div>

        ${data[0].meanings.map(meaning => `
            <div class="dictionary-definition">
                <h3>${meaning.partOfSpeech}</h3>
                <p>${meaning.definitions[0].definition}</p>
            </div>
        `).join('')}
    `;
}