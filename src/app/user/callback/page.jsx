"use client"

import { handleIncomingRedirect, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Callback() {
    const router = useRouter()

    useEffect(() => {
        if (!getDefaultSession().info.isLoggedIn) {
            handleIncomingRedirect({
                url: window.location.href,
            }).then((sessionInfo) => {
                // check if webId is present in sessionInfo
                if (!sessionInfo.webId) {
                    console.error('No WebID found in sessionInfo:', sessionInfo)
                    return
                }

                console.log('Logged in with WebID:', sessionInfo.webId)
                router.push('/user/offers')
            })
        }
    }
    , [])

    return null
}