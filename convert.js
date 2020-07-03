const puppeteer = require('puppeteer')
const exec = require('child_process').exec
const fs = require('fs-extra')

;(async () => {
    const browser = await puppeteer.launch({
        headless: true
    })
    const [page] = await browser.pages()

    // page._emulationManager._client.send(
    //     'Emulation.setDefaultBackgroundColorOverride',
    //     {color: {r: 0, g: 0, b: 0, a: 0}}
    // )

    let frame = 0
    await page.exposeFunction('takeFrame', async (frame, totalFrames) => {
        const path = `output/frame-${String(frame).padStart(5, '0')}.png`
        const progress = (frame/totalFrames * 100).toPrecision(3)
        const stringResult = ` Converting progress: ${progress} %`
        process.stdout.write(stringResult)
        process.stdout.write('\n')
        process.stdout.moveCursor(0, -1)
        await fs.mkdirp('output')
        await page.screenshot({path: path})
        frame++
    })

    await page.exposeFunction('stopAnimation', async () => {
        const ffmpeg = new Promise((resolve, reject) => {
            const result = exec(`ffmpeg -framerate 30 -i 'output/frame-%05d.png' -vcodec libx264 -vf format=yuv420p out.mov`)
            if (result.exitCode === null) {
                resolve()
            } else {
                reject()
            }
        })
        await ffmpeg.then( async () => {
            while (!await fs.pathExists('./out.mov')) {
                await page.waitFor(100)
                process.stdout.write(`Generating video: out.mov`)
                process.stdout.write('\n')
                process.stdout.moveCursor(0, -1)
            }
            process.exit(0)
        })
    })
    await page.goto('file:///Users/macintosh/Projects/svg2movie/index.html')
    await page.setViewport({width: 1280, height: 800})
})()