export const truncate = (data,maxword)=>{
    const splitQs=data.split(' ')
    if (splitQs.length>maxword-1){
    const arrData=splitQs
    let newArrData=[]
    for (let i = 0; i < arrData.length; i++) {
            if (i>maxword-1) break;
            newArrData.push(arrData[i]);
        }
        return newArrData.join(' ')
    }
    return splitQs.join(' ')
}

export const sendData=(data,csrf,numLikes,)=>{
    $.ajax(
        {
            type:'POST',
            url:'/likes/',
            data:{
                'csrfmiddlewaretoken':csrf,
                'data':data.getAttribute('value'),
            },
            success:res=>{
                numLikes.innerHTML=`<strong>likes:</strong>  ${res.data[0]['num_likes']}`
                if (res.data[0]['liked'] != true){
                data.firstElementChild.setAttribute('src','/static/img/icon/hand-thumbs-up.svg')
                data.firstElementChild.setAttribute('alt','Unlike Button')
                }else{
                data.firstElementChild.setAttribute('src','/static/img/icon/hand-thumbs-up-fill.svg')
                data.firstElementChild.setAttribute('alt','Like Button')
                }
            },
            error:err=>{
            }
    
        }
    )
        
}

export const sendComment=(data,pk,...args)=>{
    if (data.value!='') {
        $.ajax({
            type:'POST',
            url:'/add-comment/',
            data:{
                'csrfmiddlewaretoken':args[0],
                'pk':pk,
                'data':data.value,
            },
            success:res=>{
                const e=res.data[0]
                args[1].innerHTML+=
                `<section class="comment-section">
                    <div class="col justify-content-between d-flex">
                        <p class="mb-0">Dari: <strong>${e.author}</strong></p>
                        <button type="button" class="btn-close" aria-label="Close" value="${e.id}"></button>
                    </div>
                    <p class="mb-0">${e.isi}</p>
                    <div class="d-flex justify-content-end">
                        <p class="mb-0">${e.created}</p>
                    </div>
                    <hr>
                </section>`
                data.value=''
            },
            error:err=>{
            }
    
    
        })
        
    }
}

export const sendSearchData=(data,nameInput,nameTable,tableBody,csrf,detailUrl)=>{
    $.ajax(
        {
            type:'POST',
            url:'/search-admin/',
            data:{
                'csrfmiddlewaretoken':csrf,
                'data':data,
                'nameInput':nameInput['name'],
            },
            success:(res)=>{
                nameTable.innerHTML=' '
                const data =res.data
                
                if (Array.isArray(data)){
                    if (nameTable==tableBody['table-article']){
                        data.forEach((e,i)=>{
                            let published=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>`
                            if (e.published) {
                                published=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                            </svg>`
                            }
                            nameTable.innerHTML+=`<tr>
                            <th scope="row">${i+1}</th>
                            <td><a href="/${detailUrl}/${e.slug}/${e.id}/${e.category_1st_slug}" class="nav-link">${truncate(e.judul,2)}</a></td>
                            <td>${e.author}</td>
                            <td>${published}</td>
                            <td>${e.likes}</td>
                            <td>${e.updated}</td>
                            <td><a class="btn btn-danger text-capitalize" href="" role="button">delete</a> | <a class="btn btn-warning text-capitalize" href="/update/article/${e.id}" role="button">updated</a></td>
                        </tr>
                        `
                        })
                    }else if(nameTable== tableBody['table-category']){
                        data.forEach((e,i)=>{
                            nameTable.innerHTML+=`<tr>
                            <th scope="row">${i+1}</th>
                            <td>${truncate(e.name,2)}</td>
                            <td><a class="btn btn-danger text-capitalize" href="#" role="button">delete</a> | <a class="btn btn-warning text-capitalize" href="/update/category/${e.id}" role="button">updated</a></td>
                        </tr>
                        `
                        })
                    }else if(nameTable==tableBody['table-user']){
                        data.forEach((e,i)=>{
                            status=e.is_superuser && e.is_staff && e.is_active ? 'Active | Staff | Super User': e.is_staff && e.is_active ? 'Active | Staff ': 'Active'
                            nameTable.innerHTML+=`<tr>
                            <th scope="row">${i+1}</th>
                            <td>${truncate(e.username,2)}</td>
                            <td>${status}</td>
                            <td>${e.group.join(' | ')}</td>
                            <td><a class="btn btn-danger text-capitalize" href="#" role="button">delete</a> | <a class="btn btn-warning text-capitalize" href="/update/user/${e.id}" role="button">updated</a></td>
                        </tr>
                        `
                        })
                    }else if(nameTable==tableBody['table-group']){
                        data.forEach((e,i)=>{
                            nameTable.innerHTML+=`<tr>
                            <th scope="row">${i+1}</th>
                            <td>${truncate(e.name,2)}</td>
                            <td><a class="btn btn-danger text-capitalize" href="#" role="button">delete</a> | <a class="btn btn-warning text-capitalize" href="/update/group/${e.id}" role="button">updated</a></td>
                        </tr>
                        `
                        })
                    }

                }else{
                    if (nameInput.value.length>0) nameTable.innerHTML+=`<center><h3>${res.data}</h3></center>`
                    else nameTable.innerHTML+=``
                }
            },
            error:(err)=>{
            }
        }
    )
}

export const showMoreComm=(csrf,...args)=>{
    if (args[2].children.length<100) {
        $.ajax({
            url:'/show-comment/',
            type:'POST',
            data:{
                'csrfmiddlewaretoken':csrf,
                'pk':args[0],
                'data':args[1].value,
            },
            success:res=>{
                // console.log(res)
                res.data.forEach(e=>{
                    if (res.request_user == e.author){
                        args[2].innerHTML+=
                        `<section class="comment-section">
                            <div class="col justify-content-between d-flex">
                                <p class="mb-0">Dari: <strong>${e.author}</strong></p>
                                <button type="button" class="btn-close" aria-label="Close" value="${e.id}"></button>
                            </div>
                            <p class="mb-0">${e.isi}</p>
                            <div class="d-flex justify-content-end">
                                <p class="mb-0">${e.created}</p>
                            </div>
                            <hr>
                        </section>`
                    }else{
                            args[2].innerHTML+=`
                            <section class="comment-section">
                                <p class="mb-0">Dari: <strong>${e.author}</strong></p>
                                <p class="mb-0">${e.isi}</p>
                                <div class="d-flex justify-content-end">
                                    <p class="mb-0">${e.created}</p>
                                </div>
                                <hr>
                            </section>
                            `
                        }
                        args[1].value=res.end_data
                        args[4].children[0].value=res.end_data
                        if (args[2].children.length>= 11) args[4].classList.remove('d-none')
                        if (args[2].children.length===res.len_data) args[3].classList.add('d-none')
                }
            )
        },error:err=>console.log(err)
    })
        
    }
}

export const showLessComm=(comm,...args)=>{
    const children=comm.children.length
    let amount=0
    if (children%10===0)amount=children-10
    else amount=Math.floor(children/10)*10
    args[0].value=amount
    args[0].parentElement.classList.remove('d-none')
    const data=[]
    for (let i = 0; i < comm.children.length; i++) {
        if (i===amount)break;
        data.push(comm.children[i])
    }
    comm.innerHTML=''
    for (let i = 0; i < data.length; i++) {
        comm.innerHTML+=`
        <section class="comment-section">
        ${data[i].innerHTML}
        </section>
        `
    }
    if (amount===10) args[1].parentElement.classList.add('d-none')
}

export const delComment=(data,csrf)=>{
    $.ajax({
        type:'POST',
        url:'/delete-comment/',
        data:{
            'csrfmiddlewaretoken':csrf,
            'data':data
        },success:res=>{
            // console.log(res)
        },error:err=>console.log(err)
    })

}