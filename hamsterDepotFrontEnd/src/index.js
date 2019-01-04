document.addEventListener('DOMContentLoaded', () => {

  renderHamsters()

  document.querySelector('#create-link').addEventListener('click', popCreate)

  document.querySelector('#home-link').addEventListener('click', renderHamsters)

  document.querySelector('#create-form').addEventListener('submit', makeHam)

  document.querySelector('#hams').addEventListener('click', handleClick)

  document.querySelector('#edit-form').addEventListener('submit', editHam)

  document.getElementsByClassName("close")[0].addEventListener('click', (e) => {
    document.querySelector('.modal').style.display = 'none'
  })

  document.querySelector('#hams').addEventListener('keypress', handleEnter)

})



function releaseHam(id) {
  fetch (`http://localhost:3000/api/v1/hamsters/${id}`, {
    method: "DELETE"
  })

  document.querySelector(`[data-id="${id}"]`).remove()
  document.querySelector('#hamster-card').style.display = 'none'
  document.querySelector('#hams').style.display = 'flex'
}

function editHam(e) {
  e.preventDefault()
  debugger
  fetch(`http://localhost:3000/api/v1/hamsters/${e.target.dataset.id}`, {
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
    renderHamsters()
    clearEditForm()
  })

}



function clearEditForm() {
  document.querySelector('#edit-form').Name.value = ''
  document.querySelector('#edit-form').Img.value = ''
  document.querySelector('.modal').style.display = 'none'
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
  let newHam = document.createElement('div')
  newHam.dataset.id = data.id
  newHam.classList = 'ui card'
  newHam.innerHTML =
  `
      <div class = 'image'>
        <img class = 'ham-img' src=${data.image}>
      </div>
      <div class = 'content'>
        <div class = 'header'> ${data.name} </div>
      </div>
      <div class="content">
        <i class="comment icon"></i>
        ${data.comments.length}
        <ul class ='comments-list'>
        </ul>
      </div>

      <div class="extra content">
        <div class="ui large transparent left icon input">
          <input class ='add-comment' type="text" name='comment' placeholder="Add Comment...">
        </div> <br> <br>
        <div class = "ui icon buttons">
          <button type='button' class="ui button edit"><i class="edit icon"></i> </button>
          <button type='button' class="ui button trash"><i class="trash icon"></i> </button>
        </div>
      </div>
  `
  document.querySelector('#hams').append(newHam)
  data.comments.forEach((comment) => renderComments(comment))
  document.querySelector('#create-form').Name.value = ''
  document.querySelector('#create-form').Img.value = ''
  document.querySelector('#create-form').style.display = 'none'

}

function popCreate(event) {
  document.querySelector('#create-form').style.display = 'block'
  document.querySelector('#edit-form').style.display = 'none'
  document.querySelector('#hams').style.display = 'flex'
}

function domReset(event) {
  document.querySelector('#hams').style.display = 'flex'
  document.querySelector('#create-form').style.display = 'none'

}

function renderHamsters() {
  document.querySelector('#hams').innerHTML = ''
  fetch("http://localhost:3000/api/v1/hamsters")
  .then(res=>res.json())
  .then(data =>
    data.forEach((hamster) => {
      appendHamster(hamster)
      document.querySelector('#hams').style.display = 'flex'
    })
  )
  }



  function handleClick(e) {
    if (e.target.classList.contains('trash') ) {
       findIDandRelease(e.target)
    }
    else if (e.target.classList.contains('edit') ) {
      findIDandEdit(e.target)
    }
    else if (e.target.className === 'comment icon') {
       toggleComments(e.target)
    }
  }

    function findIDandRelease(element) {
      if (element.hasAttribute('data-id') == true) {
         let id = element.dataset.id
         releaseHam(id)
      }
        else {
        findIDandRelease(element.parentElement)
      }
    }


    function findIDandEdit(element) {
      if (element.hasAttribute('data-id') == true) {
         let id = element.dataset.id
         showEditForm(id)
      }
        else {
        findIDandEdit(element.parentElement)
      }
    }


    function showEditForm(id) {
      img = document.querySelector(`[data-id="${id}"]`).children[0].firstElementChild.src
      name = document.querySelector(`[data-id="${id}"]`).children[1].firstElementChild.innerText
      document.querySelector('.modal').style.display = 'block'
      populateEdit(img, name, id)
    }

    function populateEdit(img, name, id) {
      document.querySelector('#edit-form').Name.value = name
      document.querySelector('#edit-form').Img.value = img
      document.querySelector('#edit-form').dataset.id = id
    }


    function handleEnter(e) {
      if (e.target.className === 'add-comment' && e.keyCode ===13) {
        // debugger
        fetch('http://localhost:3000/api/v1/comments', {
          method: "POST",
          headers: {
            'Content-type': "application/json",
            'Accepts' : "application/json"
          },
          body: JSON.stringify({
            'content' : `${e.target.value}`,
            'hamster_id' : e.target.parentElement.parentElement.parentElement.dataset.id
        })
      })
      .then(res => res.json())
      .then(data => renderComments(data))
      e.target.parentElement.parentElement.parentElement.children[2].children[1].style.display = 'block'
      e.target.value = ''
    }
  }


  function toggleComments(target) {

    if (target.parentElement.children[1].style.display === "" || target.parentElement.children[1].style.display === "none") {
      // debugger
      target.parentElement.children[1].style.display = 'block'
    }
    else {
      target.parentElement.children[1].style.display ='none'
    }
  }



  function renderComments(comment) {
    li = document.createElement('li')
    li.innerText= comment.content
    document.querySelector(`[data-id="${comment.hamster_id}"]`).children[2].children[1].append(li)

  }
