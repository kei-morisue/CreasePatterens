

const pics = await async_list("./pics_list.txt")
const pics_list = pics.map((e) => { return "pics\\" + e })
const png = await async_list("./png_list.txt")
const png_list = png.map((e) => { return "PNG_format\\" + e })
const cp = await async_list("./cp_list.txt")
const cp_list = png.map((e) => { return "CP_format\\" + e })

var dates = new Set()
var years = new Set()

cp_list.map((e) => {
    const idx_path = e.indexOf("\\")
    const yyyymmdd = e.substring(idx_path + 1, idx_path + 11)
    const yyyy = yyyymmdd.substring(0, 4)
    dates.add(yyyymmdd)
    years.add(yyyy)
})

years = Array.from(years).sort()



const file_area = document.getElementById('file_area');
for (let j = 0; j < png_list.length; j++) {
    const work_area = document.createElement('div')
    const title_area = document.createElement('div')
    file_area.appendChild(work_area)
    work_area.appendChild(title_area)
    const res = await async_img(png_list[j])

    work_area.id = res.date
    work_area.year = res.year
    title_area.innerHTML = res.title + "&nbsp;&nbsp;&nbsp;&nbsp;@" + res.date

    work_area.appendChild(res.img)
    work_area.style.display = "none"
}

const filter_area = document.getElementById("filters")
for (const [i, k] of years.entries()) {
    const cb = document.createElement("input")
    cb.type = "checkbox"
    cb.id = k
    cb.checked = false
    filter_area.appendChild(cb)

    const label = document.createElement("label")
    label.for = cb.id
    label.innerHTML = k

    filter_area.appendChild(label)

    cb.onchange = (e) => {
        for (const k of file_area.children) {
            if (cb.id == k.year) {

                k.style.display = cb.checked ? "inline" : "none"
            }
        }
    }

}
document.getElementById("2024").click()

async function async_list(list_name) {
    return await fetch(list_name).then(
        responce => responce.text()
    ).then(
        d => {
            const names = d.split("\r\n")
            names.pop()
            return names
        }
    )
}

async function async_img(file_path) {
    return await fetch(file_path)
        .then(response => response.blob())
        .then(data => {
            const idx_path = file_path.indexOf("\\")
            const idx_ext = file_path.indexOf(".")
            const date = file_path.substr(idx_path + 1, 10)
            const title = file_path.substring(idx_path + 11, idx_ext)
            const title_no_under = title.replaceAll('_', ' ').toUpperCase().replaceAll("MORISUE KEI", "").replaceAll("CP", "")
            const img_element = document.createElement('img');
            img_element.src = URL.createObjectURL(data);
            return { img: img_element, date: date, title: title_no_under, year: date.substring(0, 4) }
        })
}