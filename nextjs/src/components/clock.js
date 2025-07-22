// app/components/Clock.js (or use in your preferred folder)
'use client'

import { useEffect, useState } from 'react'

export default function Clock() {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const pad = (n) => String(n).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const HH = pad(now.getHours())
    const MM = pad(now.getMinutes())
    const SS = pad(now.getSeconds())
    const YYYY = now.getFullYear()
    const MMM = months[now.getMonth()]
    const DD = pad(now.getDate())

    return (
        <div className="text-center">
            <p>{HH}:{MM}:{SS}</p>
            <p>{YYYY} {MMM} {DD}</p>
        </div>
    )
}
