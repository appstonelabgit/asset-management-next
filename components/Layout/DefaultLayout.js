import Portals from '../Portals';
import Header from './Header';
import SideBar from './SideBar';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <div className="bg-[#F5F7FA] font-SourceSansPro text-base font-normal leading-5 text-black antialiased">
                <div className="">
                    <SideBar />
                    <div className="main-contain">
                        <Header/>
                        {children}</div>
                </div>
                <Portals />
            </div>
        </>
    );
};

export default DefaultLayout;
