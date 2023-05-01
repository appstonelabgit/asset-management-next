import ReactDOM from 'react-dom';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import IconClose from '@/components/Icon/IconClose';
const CommonSideModal = ({ children, width, closeOnEsc = true, backdrop = true, closeButoon = true }, forwardedRef) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    const modalPanelRef = useRef();
    const openModal = () => {
        setIsOpen(true);
        document.addEventListener('keydown', handleEscKey);
    };
    const closeModal = () => {
        setIsOpen(false);
        document.removeEventListener('keydown', handleDocumentClick);
    };
    const closeByBackdrop = () => {
        if (backdrop) {
            closeModal();
        }
    };
    const handleDocumentClick = (event) => {
        if (modalPanelRef?.current?.contains(event.target)) {
            return;
        }
        closeModal();
    };
    const handleEscKey = (e) => {
        if (closeOnEsc && (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)) {
            closeModal();
        }
    };
    useImperativeHandle(forwardedRef, () => ({
        open() {
            openModal();
        },
        close() {
            closeModal();
        },
    }));
    return (
        <>
            {mounted &&
                ReactDOM.createPortal(
                    <>
                        <div
                            className={`${
                                (isOpen && '!block') || ''
                            } fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`}
                            onClick={() => closeByBackdrop()}
                        ></div>
                        <div
                            ref={modalPanelRef}
                            className={`${
                                (isOpen && '!right-0') || ''
                            } fixed top-0 bottom-0  z-[52] w-full overflow-y-auto bg-white p-5 pt-10 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] md:px-[43px] md:pb-[46px] md:pt-[52px]`}
                            style={{
                                right: isOpen ? `-${width}` : '-546px',
                                transition: 'right 0.3s ease-in-out',
                                maxWidth: width || '546px',
                            }}
                        >
                            {closeButoon && (
                                <div
                                    className="absolute right-2.5 top-2.5 cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IconClose />
                                </div>
                            )}
                            {isOpen && children}
                        </div>
                    </>,
                    document?.querySelector('#offsetright-portal')
                )}
        </>
    );
};
export default forwardRef(CommonSideModal);
