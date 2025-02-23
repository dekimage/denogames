'use client'

import LeftColumn from './components/LeftColumn'
import MiddleColumn from './components/MiddleColumn'

export default function BazaarPage() {
    return (
        <div className="mx-auto my-5">
            <div className="w-[1083px] h-[754px] border border-black mx-auto flex ">
                <LeftColumn />
                <MiddleColumn />

            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 3px;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            `}</style>
        </div>
    )
}
