document.addEventListener('DOMContentLoaded', () => {

  renderHamsters()

  document.querySelector('#create-link').addEventListener('click', popCreate)

  document.querySelector('#hams').addEventListener('click', showHam)

  document.querySelector('#home-link').addEventListener('click', renderHamsters)

  document.querySelector('#create-form').addEventListener('submit', makeHam)

  document.querySelector('#edit-button').addEventListener('click', showEditForm)

  document.querySelector('#edit-form').addEventListener('submit', editHam)

  document.querySelector('#release-button').addEventListener('click', releaseHam)


})

function releaseHam(e) {

  fetch (`http://localhost:3000/api/v1/hamsters/${e.target.parentElement.dataset.id}`, {
    method: "DELETE"
  })
  document.querySelectorAll(`[data-id="${e.target.parentElement.dataset.id}"]`)[0].remove()
  document.querySelector('#hamster-card').style.display = 'none'
  document.querySelector('#hams').style.display = 'block'
}

function editHam(e) {
  e.preventDefault()
  fetch(`http://localhost:3000/api/v1/hamsters/${e.target.parentElement.dataset.id}`, {
    method: "PATCH",
    headers: {
      'Content-type': "application/json",
      'Accepts' : "application/json"
    },
    body: JSON.stringify({
      'name' : `${e.target.Name.value}`,
      'image' : `${e.target.Img.value}`
    })
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector('#hamster-name').innerText = data.name
    document.querySelector('#hamster-img').src = data.image
    clearEditForm()
  })

}

function showEditForm(e) {
  document.querySelector("#edit-form").style.display = 'block'
  populateEditForm(e)
  document.querySelector('#create-form').style.display = 'none'
}

function populateEditForm(e) {
  document.querySelector('#edit-form').Name.value =         e.target.parentElement.children[0].innerText
  document.querySelector('#edit-form').Img.value = e.target.parentElement.children[1].src
}

function clearEditForm() {
  document.querySelector('#edit-form').Name.value = ''
  document.querySelector('#edit-form').Img.value = ''
  document.querySelector('#edit-form').style.display = 'none'
}

function makeHam(e) {
  e.preventDefault()
  fetch('http://localhost:3000/api/v1/hamsters', {
    method: "POST",
    headers: {
      'Content-type': "application/json",
      'Accepts' : "application/json"
    },
    body: JSON.stringify({
      'name' : `${e.target.Name.value}`,
      'image' : `${e.target.Img.value}`
    })
  })
  .then(res => res.json())
  .then(data => appendHamster(data))
}

function appendHamster(data) {
  let newHam = document.createElement('li')
  newHam.dataset.id = data.id
  newHam.classList.add('listed-ham')
  newHam.innerHTML =
  `<a class = 'a-ham' href = #> ${data.name}<img class = 'ham-img' src=${data.image}> </a>`
  document.querySelector('#hamster-list').append(newHam)
  document.querySelector('#create-form').style.display = 'none'

}

function popCreate(event) {
  document.querySelector('#create-form').style.display = 'block'
  document.querySelector('#edit-form').style.display = 'none'
  document.querySelector('#hamster-card').style.display = 'none'
  document.querySelector('#hams').style.display = 'block'
}

function domReset(event) {
  document.querySelector('#hams').style.display = 'block'
  document.querySelector('#hamster-card').style.display = 'none'
  document.querySelector('#create-form').style.display = 'none'

}

function renderHamsters() {
  let ul = document.getElementById("hamster-list");
    while(ul.firstChild) ul.removeChild(ul.firstChild)
  fetch("http://localhost:3000/api/v1/hamsters")
  .then(res=>res.json())
  .then(data =>
    data.forEach((hamster) => {
      appendHamster(hamster)
      document.querySelector('#hams').style.display = 'block'
      document.querySelector('#hamster-card').style.display = 'none'
    })
  )
}

function showHam(event) {
  if ( event.target.classList.contains('a-ham')) {
    document.querySelector('#create-form').style.display = 'none'
    document.querySelector('#hams').style.display = 'none'
    clearEditForm()
    document.querySelector('#hamster-card').style.display = 'block'
    document.querySelector('#hamster-card').dataset.id = event.target.parentElement.dataset.id
    document.querySelector('#hamster-name').innerText = event.target.innerText
    document.querySelector('#hamster-img').src = event.target.firstElementChild.src
  }
}
