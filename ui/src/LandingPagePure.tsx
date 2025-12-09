// Source - https://stackoverflow.com/q/76024496
// Posted by Tanish Gupta, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-09, License - CC BY-SA 4.0

import React from 'react'

const Sidebar = () => {
    return (
        <>
            <div className="flex flex-col h-screen w-64 bg-sidenavbar">

                <div className="flex items-center justify-center h-16 p-bottom-10">
                    <span className="text-white text-2xl font-bold">My App</span>
                </div>


                <div className="flex flex-col flex-1 overflow-y-auto">
                    <button className="px-6 py-3 text-white text-left hover:bg-gray-700 hover:text-texthover">
                        Dashboard
                    </button>
                    <button className="px-6 py-3 text-white text-left hover:bg-gray-700 hover:text-texthover">
                        Messages
                    </button>
                    <button className="px-6 py-3 text-white text-left hover:bg-gray-700 hover:text-texthover">
                        Calander
                    </button>
                    <button className="px-6 py-3 text-white text-left hover:bg-gray-700 hover:text-texthover">
                        Campaigns
                    </button>
                </div>


                <div className="flex items-center justify-center h-16">
                    <span className="text-gray-300">© 2023 My App. All rights reserved.</span>
                </div>
            </div>
        </>
    )
}

export default Sidebar
