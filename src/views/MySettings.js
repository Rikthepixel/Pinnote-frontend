import React from 'react'
import { CogIcon } from '../assets/img/icons'

const MySettings = () => {
    return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center px-4 pt-4">
            <article className="px-4 pt-4 w-80">
                <h2 className="section-header d-flex align-items-center">
                    <img className="me-2" alt="" src={CogIcon} />
                    Settings
                </h2>
                
            </article>
        </div>
    )
}

export default MySettings
