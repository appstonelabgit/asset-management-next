import Portals from '../Portals';
import Header from './Header';
import SideBar from './SideBar';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <div className="min-h-screen flex flex-col bg-[#F5F7FA] font-SourceSansPro text-base font-normal leading-5 text-black antialiased">
                <SideBar />
                <div className="main-contain">
                    <Header />
                    {children}
                </div>
                <Portals />
            </div>
        </>
    );
};

export default DefaultLayout;
