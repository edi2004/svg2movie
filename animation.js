const processAnimation = (element, framerate, totalDuration) => {
    element.pauseAnimations()
    element.setCurrentTime(0)

    const totalFrames = totalDuration * framerate
    let frame = 0
    // 'takeFrame' in window && takeFrame()
    setInterval(() => {
        const time = (totalDuration / totalFrames) * frame

        if (time > totalDuration) {
            // 'takeFrame' in window && takeFrame()
            // stop animation
            'stopAnimation' in window && stopAnimation()
            return
        }

        element.setCurrentTime(time)
        // take a frame
        'takeFrame' in window && takeFrame(frame, totalFrames)
        frame++
    }, 220)
}