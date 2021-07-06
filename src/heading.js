import './css/heading.css'

//导出创建元素的函数
export default () => {
    const element = document.createElement('h2')
    element.textContent = 'hello webpack'
    element.classList.add('heading')
    element.addEventListener('click', () => {
        alert("hello webpack!")
    })
    return element
}