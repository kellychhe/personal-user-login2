const position = document.getElementsByClassName('positionFilled')
const deleteListing = document.getElementsByClassName('delete');
// const deleteComment = document.getElementsByClassName("fa-ban");

Array.from(position).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = this.parentNode.id
    const positionFilled = this.parentNode.classList.toggle('filled')
    console.log(this.parentNode)
    fetch('jobListings', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '_id': _id,
        'positionFilled': positionFilled
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        window.location.reload(true)
      })
      .catch(console.error)
  });
});

Array.from(deleteListing).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = this.parentNode.id
    console.log(_id)
    fetch('jobListings', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': _id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

// Array.from(deleteComment).forEach(function (element) {
//   element.addEventListener('click', function () {
//     const _id = this.parentNode.parentNode.parentNode.parentNode.id
//     const name = this.parentNode.parentNode.children[0].innerText
//     const comment = this.parentNode.parentNode.children[2].innerText
//     console.log(_id, name, comment)
//     fetch('comments', {
//       method: 'put',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         '_id': _id,
//         'name': name,
//         'comment': comment
//       })
//     })
//       .then(response => {
//         if (response.ok) return response.json()
//       })
//       .then(data => {
//         window.location.reload(true)
//       })
//       .catch(console.error)
//   });
// });
