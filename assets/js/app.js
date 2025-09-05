const cl = console.log;

const postsForm = document.getElementById('postsForm');
const userIdControl = document.getElementById('userId');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const postsContainer = document.getElementById('postsContainer');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const loader = document.getElementById('loader');

let base_url = `https://jsonplaceholder.typicode.com`;
let postsData_url = `${base_url}/posts`;

const showLoader = () => {
    loader.classList.remove('d-none')
};

const hideLoader = () => {
    loader.classList.add('d-none')
};

const snackBar = (msg, icon) => {
    hideLoader()
    swal.fire({
        title: msg,
        icon: icon,
        // timer: 2500
    })
};

const makeAPIcall = (method, url, body, callback) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader('Authorization', 'JWT from LS')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(body))
    return xhr
};

const templating = (arr) => {
    let result = ``
    arr.forEach(obj => {
        result += `
            <div class="col-lg-4 col-md-6 mb-3" id="${obj.id}">
                <div class="card h-100 postCard">
                    <div class="card-header postHead color-dark">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body postBody color-light">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer postFoot color-dark d-flex justify-content-between align-items-center">
                        <div class="button-group">
							<button onclick="onEdit(this)" class="btn btn-primary m-2">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
						</div>
						<span>User ${obj.userId}</span>
                    </div>
                </div>
            </div>`
        postsContainer.innerHTML = result;   
    })
    hideLoader() 
};

const showNewPost = (obj) => {
    let newCol = document.createElement('div')
    newCol.innerHTML = `
            <div class="card h-100 postCard">
                    <div class="card-header postHead color-dark">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body postBody color-light">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer postFoot color-dark d-flex justify-content-between align-items-center">
                        <div class="button-group">
							<button onclick="onEdit(this)" class="btn btn-primary m-2">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
						</div>
						<span>User ${obj.userId}</span>
                    </div>
            </div>`
    newCol.className = `col-lg-4 col-md-6 mb-3`

    newCol.id = localStorage.getItem('newId')
    localStorage.removeItem('newId')

    postsContainer.prepend(newCol)
    postsForm.reset()
    snackBar(`New post added successfully!!!`, `success`)
};

const patch = (obj) => {
    userIdControl.value = obj.userId
    titleControl.value = obj.title
    bodyControl.value = obj.body

    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')

    hideLoader()
};

const showUpdatedPost = (obj) => {
    if(document.getElementById(obj.id) == null){
        snackBar(`Post not found...`, `error`)
    }else{
        let children = document.getElementById(obj.id).firstElementChild.children
        children[0].innerHTML = `<h4 class="m-0">${obj.title}</h4>`
        children[1].innerHTML = `<p class="m-0">${obj.body}</p>`
        children[2].lastElementChild.innerHTML = `User ${obj.userId}`
        snackBar(`Post updated Successfully!!!`, `success`)
    }

    postsForm.reset()
    addBtn.classList.remove('d-none')
    updateBtn.classList.add('d-none')
};

const fetchPosts = () => {
    showLoader()
    let xhr = makeAPIcall('GET', postsData_url)

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response).reverse()
            templating(data)
        }else{
            let msg = `Something went wrong while fetching posts...`
            console.error(msg)
            snackBar(msg, `error`)
        }
    }

    xhr.onerror = () => {
        snackBar(`Network error occurred during XHR request`, `error`)
    }
};

fetchPosts()

const onPostAdd = (eve) => {
    showLoader()
    eve.preventDefault()

    let newPost = {
        userId: userIdControl.value,
        title: titleControl.value,
        body: bodyControl.value
    }

    let xhr = makeAPIcall('POST', postsData_url, newPost)

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            let newId = JSON.parse(xhr.response).id
            localStorage.setItem('newId', newId)
            showNewPost(newPost)
        }else{
            let msg = `Something went wrong while submitting post...`
            console.error(msg)
            snackBar(msg, `error`)
        }
    }

    xhr.onerror = () => {
        snackBar(`Network error occurred during XHR request`, `error`)
    }
};

const onEdit = (ele) => {
    showLoader()
    let editId = ele.closest('.col-md-6').id
    localStorage.setItem('editId', editId)
    let edit_url = `${postsData_url}/${editId}`

    let xhr = makeAPIcall('GET', edit_url)

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status <= 299){
            let editPost = JSON.parse(xhr.response)
            patch(editPost)
        }else{
            let msg = `Something went wrong while getting post...`
            console.error(msg)
            snackBar(msg, `error`)
        }
    } 
    
    xhr.onerror = () => {
        snackBar(`Network error occurred during XHR request`, `error`)
    }
};

const onPostUpdate = () => {
    showLoader()
    if(titleControl.value && bodyControl.value){
        let updateId = localStorage.getItem('editId')
        localStorage.removeItem('editId')
        let update_url = `${postsData_url}/${updateId}`
    
        let updatedPost = {
            userId: userIdControl.value,
            title: titleControl.value,
            body: bodyControl.value,
            id: updateId
        }
    
        let xhr = makeAPIcall('PATCH', update_url, updatedPost)
    
        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status <= 299){
                // let updatedPost = JSON.parse(xhr.response)
                showUpdatedPost(updatedPost)
            }else{
                let msg = `Something went wrong while updating post...`
                console.error(msg)
                snackBar(msg, `error`)
            }
        }
        
        xhr.onerror = () => {
            snackBar(`Network error occurred during XHR request`, `error`)
        }
    }else{
        snackBar(`Input field can't be empty while updating...`, `warning`)
    }
};

const onRemove = (ele) => {
    let removeId = ele.closest('.col-md-6').id
    let remove_url = `${postsData_url}/${removeId}`

    Swal.fire({
        title: "Do you really want to delete this post?",
        text: "Post will be deleted permanently",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#0275d8",
        confirmButtonText: "Delete"
    }).then((result) => {
        if (result.isConfirmed){
            showLoader()
            let xhr = makeAPIcall('DELETE', remove_url)

            xhr.onload = () => {
                if(xhr.status >= 200 && xhr.status <= 299){
                    ele.closest('.col-md-6').remove()
                    snackBar(`Post deleted successfully!!!`, `success`)
                }else{
                    let msg = `Something went wrong while deleting post...`
                    console.error(msg)
                    snackBar(msg, `error`)
                }
            }
            
            xhr.onerror = () => {
                snackBar(`Network error occurred during XHR request`, `error`)
            }    
        }
});
};

postsForm.addEventListener('submit', onPostAdd);
updateBtn.addEventListener('click', onPostUpdate);