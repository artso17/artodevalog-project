const pk=window.location.pathname.split("/")[3]
const btn =document.getElementsByClassName('btn')
const likeBtn=document.getElementsByClassName('like')
const csrf=document.getElementsByName('csrfmiddlewaretoken')[0].value
const numLikes=document.getElementsByClassName('num-likes')[0]
const commentInput=document.getElementById('comment')
const commentCont=document.getElementsByClassName('comment-container')[0]
const images=document.querySelectorAll('[data-src]')
console.log(images)
// console.log(socialShare[0])
import * as modul from './module.js'
const preloadImage=(entry)=>{
    const src=entry.getAttribute('data-src');
    if(!src) return
    entry.src=src
}

const imgOptions={
    threshold:0,
    rootMargin: '0px 0px 300px 0px'
}

const imgObserver= new IntersectionObserver((entries,imgObserver)=>{
    entries.forEach(entry=>{
        if (!entry.isIntersecting) return
        else{
            preloadImage(entry.target)
            imgObserver.unobserve(entry.target)
        }
    })
},imgOptions)
images.forEach(image=>imgObserver.observe(image))


images.forEach(image=>imgObserver.observe(image))


// console.log(encodeURIComponent(posttitle))
// socialShare['facebook_share'].setAttribute('href',`https://www.facebook.com/sharer.php?u=${postUrl}`)
// socialShare['whatsapp_share'].setAttribute('href',`https://api.whatsapp.com/send?text=${posttitle} ${postUrl}`)
// socialShare['linkedin_share'].setAttribute('href',`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${posttitle}`)
if (btn['show_more']!= undefined) btn['show_more'].addEventListener('click',e=>modul.showMoreComm(csrf,pk,e.target,commentCont,e.target.parentNode,btn['show_less'].parentNode))

btn['show_less'].addEventListener('click',e=>{
    const commentContain=document.getElementsByClassName('comment-container')[0]
    const btn =document.getElementsByClassName('btn')
    modul.showLessComm(commentContain,btn['show_more'],e.target)
})

if (likeBtn['like']!=undefined) likeBtn['like'].addEventListener('click',()=>modul.sendData(likeBtn['like'],csrf,numLikes))

document.getElementsByClassName('comment-container')[0].addEventListener('click',e=>{
    const btn=e.target
    if (btn.className == 'btn-close'){
            modul.delComment(e.target.value,csrf)
            btn.parentNode.parentNode.parentNode.removeChild(btn.parentNode.parentNode)
        }
    }
)

if (btn['comment_btn'] != undefined) btn['comment_btn'].addEventListener('click',()=>modul.sendComment(commentInput,pk,csrf,commentCont))