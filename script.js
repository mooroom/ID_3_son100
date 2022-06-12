const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let particleArray = []

let mouse = {
    x: null,
    y: null,
    radius: 200
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x + canvas.clientLeft/2
    mouse.y = event.y + canvas.clientTop/2
})


function drawImage() {
    let imageWidth = png.width
    let imageHeight = png.height
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas.width/2 - png.width * 2
            this.y = y + canvas.height/2 - png.height * 2
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2
            this.baseY = y + canvas.height/2 - png.height * 2
            this.density = (Math.random() * 10) + 2
        }
        draw() {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        }
        update() {
            
            ctx.fillStyle = this.color

            //collision detection

            let dx = mouse.x - this.x
            let dy = mouse.y - this.y
            let distance = Math.sqrt(dx * dx + dy * dy)
            let forceDirectionX = dx / distance
            let forceDirectionY = dy / distance

            const maxDistance= 200
            let force = (maxDistance - distance) / maxDistance
            if (force < 0) force = 0


            let directionX = (forceDirectionX * force * this.density * 1)
            let directionY = (forceDirectionY * force * this.density * 1)

            if (distance < mouse.radius + this.size) {
                //spread over mouse pos
                this.x -= directionX
                this.y -= directionY
                
            } else {
                //return to base
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX
                    this.x -= dx / 20
                } if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY
                    this.y -= dy / 20
                }
            }

            this.draw()
        }
    }

    function init() {
        particleArray = []

        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 0) {
                    let positionX = x
                    let positionY = y
                    let red = data.data[(y * 4 * data.width) + (x * 4)]
                    let green = data.data[(y * 4 * data.width) + (x * 4) + 1]
                    let blue = data.data[(y * 4 * data.width) + (x * 4) + 2]
                    let color = `rgb(${red}, ${green}, ${blue})`
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color))
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate)
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        ctx.fillRect(0, 0, innerWidth, innerHeight)

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update()
        }
    }
    init()
    animate()

    window.addEventListener('resize', function() {
        canvas.width = innerWidth
        canvas.height = innerHeight
        init()
    })
}

const png = new Image()
const png2 = new Image()
// png.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAApCAYAAABDV7v1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGBWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDEtMDNUMDE6MjM6MzErMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAxLTAzVDA1OjM3OjA1KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAxLTAzVDA1OjM3OjA1KzA5OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODI2YzJjN2QtMzc0NC0xYjQ4LWI1MDMtMGJhNWQ0M2UxOGM4IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc3MGJmZmYwLTNlMDUtNGQ0ZC05MzQxLTkxNjBiYjhlNWIyZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Y2FkYmUwZjItMzcxYy1jMDRiLTg2YmUtYTU0ODQ1Y2IwYWJjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZjMwNDk4YS1jYzI5LTQ2MDYtOWE5My03MzhjNWY5OGExYTAiIHN0RXZ0OndoZW49IjIwMjEtMDEtMDNUMDE6MjM6MzErMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NzBiZmZmMC0zZTA1LTRkNGQtOTM0MS05MTYwYmI4ZTViMmUiIHN0RXZ0OndoZW49IjIwMjEtMDEtMDNUMDU6Mzc6MDUrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgJrv7UAAAwPSURBVFiFVZnfr2ZnVcc/az3Pft9zZk5nmJnSmWk7TdE6FKdCaR2gWmgF0UaSRkssBBsxNBkMQUkIMfFurr3yTzAIrUTRqE0U64UkRkebFoR6pfKjFsRayvw6M+fs/ay1vFjP3u/h3JzMmX32+zxrfX+tdeTcuz8WEaACzRruTptGwhvuDXfDvBHRiDAiAtWKaqHoCi2KSGUY1gQK4ZS6otQVhDOstlEtDHVNqRURQUSX720aaW3Ew4kwzBoA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'
png.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABXUlEQVRoge2YgW3DIBBFz1UX8ApZISu4IzQjZAWv0F0ygjOCO4I7QjvCr0AgYXwU26DGVf+TIuzAx3wOrMNCCCGEEEIeC4ArgCH4XX8aEIAewIQ5RtfnjJRocx13WKJ2CuAM4FNpHzICONXUrjHRJzpcGAHQrhiIZ6ql9TwlDLyacIrI2wbfZrm1K9ueosko0S5ZGd5UREal3eDqBqVurKH1xBFpN8xMjKZ7j8rZzEbP3au1qEtrJ9om/IrKkHDwJVrLc3Rv3L+4605Eyl55v8jMSNM0xv3d3d7Npk/M1uHILa2PvxKRmnvkodDI0aCRo0EjR4NGjkZNI1py58ll1CVaS00jWjrTufKs1IXpeYnWEme/JdyUh9rzfqLPW3S9V5sncTpLnRBb5etHCtOuraH1VFta7ghwyax3cfUX175Yu4otEfG42dW+TU3u/+TmLdESQggh/x5CSAYR+QYOWceS9RnhwAAAAABJRU5ErkJggg=='
// png.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABrklEQVRoge2Zv66CMBSHz71x07iQ4M6Am5szie9AwjvoK/AIjGy8iYPPwCiJzLAamHtzSGr40yJKb+655nxJg7T9NXytEopfACDgA/j+BAlgEYKwCDVYhBosQg0WocYkkSiKIE3TR8HzMZIkgbIsQQjxKJjD+mfMyYqxcjweRZ8kSZSZIAhEVVWD/m1ut5s4HA5Gs/LBVyuCF6xCJeK67tMLkZRlaSw7KhKGoUjTVDuYSkQnPWWMOVmlyJTl1Q2Ey94HJwPbVJOC/U1kZen82C3LguVy+db9aLVaDequ12vn2Gaz2RjJSozdfm3bHtTd7/fOsU17wuZkJYv2yfl8htPp1Hz2PA9833/d6I/oiGRZ1hQkjuPmfq6aLYqMfrWKovg3K8LPWtRgEWqwCDVYhBos0qeua23ber3+tazEmAg+l/XZ7/dNzXa7HbTleW4kK1kMat7kcrmA4zid8G63a14eqMD+kjnZNto9u267q9uz4356CtgP+5vITnr58IrI1K0ytmM/k1njInJlsL0/w3iO9ZrZnJ3lP0OpwSLUYBFqsAg1WIQaLEKNzxABgB9NWBQHmOku2wAAAABJRU5ErkJggg==';
png2.src = 'data:image/png;base64,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'

window.addEventListener('load', (event) => {
    console.log('page has loaded')
    // ctx2.drawImage(png2, 0, 0)
    ctx.drawImage(png, 0, 0)
    
    // drawImage2()
    drawImage()
    
})