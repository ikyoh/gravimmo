import Menu from '../menu/Menu'
import MenuMobile from '../menu/MenuMobile'


export const Layout = ({ children }) => {
    return (
        <>
            <div className='flex flex-col-reverse md:flex-row min-h-screen'>
                <div className='fixed bottom-0 w-full md:w-[110px] md:h-screen md:sticky md:top-0 z-10'>
                    <MenuMobile />
                    <Menu />
                </div>
                <div className='grow flex flex-col mb-[5.5rem]'>
                    {children}
                </div>
            </div>
        </>
    )
}

