const cl = console.log;

const postsForm = document.getElementById('postsForm');
const userIdControl = document.getElementById('userId');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const display = document.getElementById('display');

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
							<button class="btn btn-primary mr-2">Edit</button>
                            <button class="btn btn-danger">Remove</button>
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
							<button class="btn btn-primary mr-2">Edit</button>
                            <button class="btn btn-danger">Remove</button>
						</div>
						<span>by User ${obj.userId}</span>
                    </div>
            </div>`
    newCol.className = `col-md-4 mb-3`

    newCol.id = localStorage.getItem('newId')
    localStorage.removeItem('newId')
    
    display.prepend(newCol)
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

postsForm.addEventListener('submit', onPostAdd);