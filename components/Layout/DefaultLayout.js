import Portals from '../Portals';
import Header from './Header';
import Sidebar from './Sidebar';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <div className="bg-[#F5F7FA] font-SourceSansPro text-base font-normal leading-5 text-black antialiased">
                <div className="flex flex-nowrap items-start">
                    <Sidebar />
                    <div className="flex flex-1 flex-col">
                        <Header/>
                        {children}</div>
                </div>
                <Portals />
            </div>
        </>
    );
};

export default DefaultLayout;
