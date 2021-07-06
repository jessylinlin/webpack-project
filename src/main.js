// // //导入模块
import createHeading from './heading.js'
import './css/main.css'
import icon from './image/2.jpg'
import { updateLocale } from 'yargs'

const heading = createHeading()

document.body.append(heading)

// //接受资源模块的默认导出
const img = new Image()
img.src = icon
document.body.append(img)

// import './css/main.css'
// import footerHtml from './footer.html'
// //会将html作为字符串导出
// document.write(footerHtml)

const ul = document.createElement('ul')
document.body.append(ul)

//跨域请求 虽然github支持cors 但是不是每个服务端都支持
fetch('https://api.github.com/users')
fetch('/api/users')
    .then(res => res.json())
    .then(data => {
        data.forEach(item => {
            const li = document.createElement('li')
            li.textContent = item.login
            ul.append(li)
        })
    })