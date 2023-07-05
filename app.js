document.getElementById('urlForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var url = document.getElementById('urlInput').value;
  if (url) {
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayInsight(data);
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  }
});

function displayInsight(insight) {
  var tableBody = document.getElementById('insightsBody');
  var row = tableBody.insertRow();
  row.innerHTML = `
    <td>${insight.url}</td>
    <td>${insight.wordCount}</td>
    <td>${insight.favorite}</td>
    <td>${insight.mediaLinks}</td>
    <td>
      <button class="favoriteBtn" data-url="${insight.url}" data-favorite="${insight.favorite}">${
    insight.favorite ? 'Remove Favorite' : 'Add to Favorites'
  }</button>
      <button class="removeBtn" data-url="${insight.url}">Remove</button>
    </td>
  `;

  // Attach event listeners to the buttons
  var favoriteBtn = row.querySelector('.favoriteBtn');
  var removeBtn = row.querySelector('.removeBtn');
  favoriteBtn.addEventListener('click', toggleFavorite);
  removeBtn.addEventListener('click', removeInsight);
}

function toggleFavorite(event) {
  var url = event.target.dataset.url;
  var favorite = event.target.dataset.favorite === 'true';
  fetch(`/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      favorite: !favorite,
    }),
  })
    .then(function () {
      event.target.dataset.favorite = !favorite;
      event.target.textContent = !favorite ? 'Remove Favorite' : 'Add to Favorites';
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

function removeInsight(event) {
  var url = event.target.dataset.url;
  fetch(`/${url}`, {
    method: 'DELETE',
  })
    .then(function () {
      var row = event.target.parentNode.parentNode;
      row.parentNode.removeChild(row);
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}
