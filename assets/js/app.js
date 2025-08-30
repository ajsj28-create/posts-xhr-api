const cl = console.log;

const postsForm = document.getElementById('postsForm');
const userIdControl = document.getElementById('userId');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const display = document.getElementById('display');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');

let base_url = `https://jsonplaceholder.typicode.com`;
let postsData_url = `${base_url}/posts`;

const templating = (arr) => {
    let result = ``
    arr.forEach(obj => {
        result += `
            <div class="col-md-4 mb-3" id="${obj.id}">
                <div class="card h-100">
                    <div class="card-header postHead color-dark">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body postBody color-light">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer color-dark d-flex justify-content-between align-items-center">
                        <div class="button-group">
							<button onclick="onEdit(this)" class="btn btn-primary mr-2">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
						</div>
						<span>by User ${obj.userId}</span>
                    </div>
                </div>
            </div>`
        
        display.innerHTML = result;    
    })
};

const showNewPost = (obj) => {
    let newCol = document.createElement('div')
    newCol.innerHTML = `
            <div class="card h-100">
                    <div class="card-header postHead color-dark">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body postBody color-light">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer color-dark d-flex justify-content-between align-items-center">
                        <div class="button-group">
							<button onclick="onEdit(this)" class="btn btn-primary mr-2">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
						</div>
						<span>by User ${obj.userId}</span>
                    </div>
            </div>`
    newCol.className = `col-md-4 mb-3`

    newCol.id = localStorage.getItem('newId')
    localStorage.removeItem('newId')
    
    display.prepend(newCol)
    postsForm.reset()
};

const patch = (obj) => {
    userIdControl.value = obj.userId
    titleControl.value = obj.title
    bodyControl.value = obj.body

    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
};

const fetchPosts = () => { // GET method

    let xhr = new XMLHttpRequest()

    xhr.open('GET', postsData_url, true)

    xhr.send(null)

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response)
            templating(data)
        }else{
            console.error(`Something went wrong...`)
        }
    }
};

fetchPosts()

const onPostAdd = (eve) => {
    eve.preventDefault()

    let newPost = {
        userId: userIdControl.value,
        title: titleControl.value,
        body: bodyControl.value
    }

    // POST method

    let xhr = new XMLHttpRequest()

    xhr.open('POST', postsData_url, true)

    xhr.send(JSON.stringify(newPost))

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            let newId = JSON.parse(xhr.response).id
            localStorage.setItem('newId', newId)
            showNewPost(newPost)
        }else{
            console.error(`Something went wrong...`)
        }
    }
};

const onEdit = (ele) => {
    let editId = ele.closest('.col-md-4').id
    localStorage.setItem('editId', editId)

    // GET method
    let xhr = new XMLHttpRequest()

    xhr.open('GET', `${postsData_url}/${editId}`, true)

    xhr.send(null)

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            let editPost = JSON.parse(xhr.response)
            patch(editPost)
        }else{
            console.error(`Something went wrong...`)
        }
    }    
};

const onPostUpdate = () => {
    let updateId = localStorage.getItem('editId')
    localStorage.removeItem('editId')

    let updatedPost = {
        userId: userIdControl.value,
        title: titleControl.value,
        body: bodyControl.value,
        id: updateId
    }

    // PUT method

    let xhr = new XMLHttpRequest()

    xhr.open('PATCH', `${postsData_url}/${updateId}`, true)

    xhr.send(JSON.stringify(updatedPost))

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            // let newId = JSON.parse(xhr.response).id
            // localStorage.setItem('newId', newId)
            // showNewPost(newPost)
            cl(xhr.response)
            showUpdatedPost()
        }else{
            console.error(`Something went wrong...`)
        }
    }    
};


















postsForm.addEventListener('submit', onPostAdd);
updateBtn.addEventListener('click', onPostUpdate);